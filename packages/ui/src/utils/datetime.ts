import { isDate } from 'es-toolkit'
import { isNumber } from 'es-toolkit/compat'
import { SetRequired } from 'type-fest'

const DATE_SHORT: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
} as const

const TIME_SIMPLE: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
} as const

const DATETIME_SHORT: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
} as const

interface TimeZoneOffsetOptions {
    /**
     * What style of offset to return.
     */
    format?: 'short' | 'long' | undefined
    /**
     * What locale to return the offset name in.
     */
    locale?: string | undefined
}

/**
 * What style of offset to return.
 * Returning '+6', '+06:00', or '+0600' respectively
 */
type TimeZoneOffsetFormat = 'narrow' | 'short' | 'techie'

/**
 * Get an instance of a fixed offset timezone from a UTC offset string, like "UTC+6"
 * @param ts
 * @param offsetFormat
 * @param locale
 * @param timeZone
 * @returns
 */
function parseTimeZoneInfo(
    ts: number,
    offsetFormat: TimeZoneOffsetOptions['format'],
    locale: TimeZoneOffsetOptions['locale'],
    timeZone: string | null = null,
) {
    const date = new Date(ts)
    const intlOpts: Intl.DateTimeFormatOptions = {
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }

    if (timeZone) {
        intlOpts.timeZone = timeZone
    }

    const modified = { timeZoneName: offsetFormat, ...intlOpts }

    const parsed = new Intl.DateTimeFormat(locale, modified)
        .formatToParts(date)
        .find(m => m.type.toLowerCase() === 'timezonename')

    return parsed ? parsed.value : null
}

function formatTimeZoneOffset(offset: number, format: TimeZoneOffsetFormat) {
    const hours = Math.trunc(Math.abs(offset / 60))
    const minutes = Math.trunc(Math.abs(offset % 60))
    const sign = offset >= 0 ? '+' : '-'

    switch (format) {
        case 'short':
            return `${sign}${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}`
        case 'narrow':
            return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ''}`
        case 'techie':
            return `${sign}${hours.toString().padStart(2, '0')}${minutes
                .toString()
                .padStart(2, '0')}`
        default:
            throw new RangeError(`Value format ${format} is out of range for property format`)
    }
}

function signedOffset(offsetHours: string, offMinutes: string) {
    let offHour = parseInt(offsetHours, 10)

    // don't || this because we want to preserve -0
    if (Number.isNaN(offHour)) offHour = 0

    const offMin = parseInt(offMinutes, 10) || 0,
        offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin

    return offHour * 60 + offMinSigned
}

/**
 * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
 * @param {string} offset - The offset string to parse
 * @example FixedOffsetZone.parseFixedOffsetTimeZone("UTC+6")
 * @example FixedOffsetZone.parseFixedOffsetTimeZone("UTC+06")
 * @example FixedOffsetZone.parseFixedOffsetTimeZone("UTC-6:00")
 * @return {FixedOffsetZone}
 */
function parseFixedOffsetTimeZone(offset: string): string | null {
    const matches = offset.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i)

    if (matches) {
        const [_, hoursOffset, minutesOffset] = matches
        return getFixedOffset(signedOffset(hoursOffset, minutesOffset))
    }

    return null
}

function getFixedOffset(offset: number) {
    return offset === 0 ? 'UTC' : `UTC${formatTimeZoneOffset(offset, 'narrow')}`
}

const SystemDTF = new Intl.DateTimeFormat().resolvedOptions()

function normalizeTimeZone(
    timeZone: number | string | null | undefined,
    defaultZone: string = SystemDTF.timeZone,
) {
    if (timeZone == null || timeZone === 'default') {
        return defaultZone
    }
    if (typeof timeZone === 'string') {
        const tz = timeZone.toLocaleLowerCase()
        switch (tz) {
            case 'local':
            case 'system':
                return SystemDTF.timeZone
            case 'utc':
            case 'gmt':
                return 'UTC'
            default:
                const offset = parseFixedOffsetTimeZone(tz)
                if (offset == null) {
                    try {
                        return new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions()
                            .timeZone
                    } catch {
                        console.warn(
                            `Recieved an invalid timeZone name of "${tz}". Returning default system timeZone instead.`,
                        )
                        return SystemDTF.timeZone
                    }
                }
                return offset
        }
    }

    if (typeof timeZone === 'number') {
        return getFixedOffset(timeZone)
    }

    console.warn(`Warning: "${timeZone}" probably isn't a valid timezone.`)
    return SystemDTF.timeZone
}

type DateTimeOptions = Intl.DateTimeFormatOptions & {
    offset?: number
    timestamp?: number
    locale?: string | undefined
}

type DateTimeOptionWithOffset = SetRequired<DateTimeOptions, 'offset'>

export class DateTime {
    private static utcInstance: DateTime

    static getUtcInstance() {
        if (!this.utcInstance) {
            this.utcInstance = DateTime.fromOffset(0)
        }
        return this.utcInstance
    }

    /** Get an instance with a specified offset */
    static fromOffset(options: number | DateTimeOptionWithOffset): DateTime {
        const offset = typeof options === 'number' ? options : options.offset
        return offset === 0 ?
                DateTime.utcInstance
            :   new DateTime(options as DateTimeOptionWithOffset)
    }

    static fromDate(date: Date, options?: Intl.DateTimeFormatOptions) {
        if (!isDate(date)) {
            throw new Error(
                'A valid Date object must be passed first when using DateTime.fromDate().',
            )
        }
        const ts = date.valueOf()
        const timeZone = normalizeTimeZone(options?.timeZone, SystemDTF.timeZone)

        return new DateTime({ timestamp: ts, ...{ ...options, timeZone } })
    }

    static create(options: DateTimeOptions) {
        if (isNumber(options.offset)) {
            return DateTime.fromOffset(options as DateTimeOptionWithOffset)
        }
        return new DateTime(options)
    }

    static DATE_SHORT = DATE_SHORT
    static TIME_SIMPLE = TIME_SIMPLE
    static DATETIME_SHORT = DATETIME_SHORT

    private ts: number
    private tz: string
    private locale: string
    private options: Intl.DateTimeFormatOptions
    private formatter: Intl.DateTimeFormat

    /** @ts-expect-error - TS inference says this isn't used but that's a bald-faced lie! */
    private d: string

    private resolvedOptions: Intl.ResolvedDateTimeFormatOptions

    private constructor({ timestamp, locale = undefined, offset, ...options }: DateTimeOptions) {
        this.options ||= options
        this.ts = timestamp ?? Date.now()
        const timeZone = normalizeTimeZone(isNumber(offset) ? offset : options?.timeZone)

        this.formatter = new (Intl.DateTimeFormat as Intl.DateTimeFormatConstructor)(locale, {
            ...options,
            timeZone,
        })

        const resolved = this.formatter.resolvedOptions()
        this.locale ||= resolved.locale
        this.tz ||= resolved.timeZone
        this.resolvedOptions ||= resolved

        this.d = this.formatter.format(this.ts)
    }

    now() {
        this.ts = Date.now()
        this.d = this.formatter.format(this.ts)
        return this
    }

    format(formatter: Intl.DateTimeFormat = this.formatter) {
        return formatter.format(this.ts)
    }

    toLocaleString(opts: Omit<DateTimeOptions, 'timestamp'>) {
        const { locale = this.locale, ...options } = opts
        const formatOpts = { ...this.options, ...options }
        const formatter = new Intl.DateTimeFormat(locale, formatOpts)
        return this.format(formatter)
    }

    getResolvedProperty(property: keyof Intl.ResolvedDateTimeFormatOptions) {
        return this.resolvedOptions[property]
    }

    /** Returns the offset's common name (such as EST) at the specified timestamp. */
    offsetName(
        ts: number,
        offsetFormat: TimeZoneOffsetOptions['format'],
        locale: TimeZoneOffsetOptions['locale'] = this.locale,
    ) {
        return parseTimeZoneInfo(ts, offsetFormat, locale)
    }

    /** Returns the offset's value as a string. */
    formatOffset(timestamp: number, format: TimeZoneOffsetFormat) {
        return formatTimeZoneOffset(this.getOffset(timestamp), format)
    }

    /**
     * Return the offset in minutes for this zone at the specified timestamp.
     */
    getOffset(timestamp: number | string) {
        return -new Date(timestamp).getTimezoneOffset()
    }
}
