import { memo, useState, type ReactNode } from 'react'
import { Modal, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native'

import { FlashList } from '@shopify/flash-list'
import { useEffectEvent } from '@ui/hooks/use-effect-event'
import { StyleSheet } from 'react-native-unistyles'

import { Checkbox } from './form/checkbox'
import { Radio } from './form/radio-input'
import { SearchField } from './form/search-field'
import { Spacer } from './layout/spacer'
import { Stack } from './layout/stack'
import StatusBar from './status-bar'
import { Text } from './text'

type Option = {
    label: string
    value: string
}

type BaseProps = {
    label: string
    emptyContent?: ReactNode
    options: Option[]
    isVisible: boolean
    onClose: () => void
}

type SingleValueProps = {
    multiple?: false
    selected: string
    onConfirm: (option: string) => void
}

type MultipleValueProps = {
    multiple: true
    selected: string[]
    onConfirm: (option: string[]) => void
}

type Props = BaseProps & (SingleValueProps | MultipleValueProps)

/** Use this picker for picking options from a LONG list of options that need filtering capabilities */
export function PickerSheet({
    label,
    emptyContent,
    options,
    isVisible,
    selected,
    multiple,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <ModalContent
                label={label}
                emptyContent={emptyContent}
                options={options}
                selected={selected}
                multiple={multiple}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </Modal>
    )
}

function ModalContent({
    label,
    emptyContent,
    options,
    selected: _selected,
    multiple = false,
    onClose,
    onConfirm,
}: Omit<Props, 'isVisible'>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selected, setSelected] = useState(_selected)

    const visibleOptions = options.filter(option =>
        searchTerm ? option.label.toLowerCase().includes(searchTerm.toLowerCase()) : true,
    )

    function handleDone() {
        // TODO: Fix this type
        // eslint-disable-next-line typescript-eslint/no-explicit-any
        onConfirm(selected as any)
        requestAnimationFrame(() => {
            onClose()
        })
    }

    const handleOptionSelect = useEffectEvent((value: string) => {
        if (multiple) {
            const current = selected as string[]
            const isChecked = current.includes(value)
            const newSelected = isChecked ? current.filter(o => o !== value) : [...current, value]

            setSelected(newSelected)
        } else {
            setSelected(value)
            setTimeout(() => {
                handleDone()
            }, 200)
        }
    })

    function handleOptionClear() {
        setSelected(multiple ? [] : '')
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ListHeader
                label={label}
                searchTerm={searchTerm}
                numSelected={
                    multiple ? selected?.length
                    : selected ?
                        1
                    :   0
                }
                onSearch={setSearchTerm}
                onClearOption={handleOptionClear}
            />
            <FlashList
                data={visibleOptions}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(option: Option) => option.value}
                ItemSeparatorComponent={ListSeparator}
                ListEmptyComponent={<ListEmpty>{emptyContent}</ListEmpty>}
                scrollIndicatorInsets={{ top: 100 }} // approximation of header height
                renderItem={({ item }) => {
                    return (
                        <ListItem
                            multiple={multiple}
                            checked={
                                multiple ? selected.includes(item.value) : selected === item.value
                            }
                            onOptionSelect={handleOptionSelect}
                            value={item.value}
                            label={item.label}
                        />
                    )
                }}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onClose}
                    accessibilityLabel="Close the picker"
                    accessibilityHint="Close the picker without selecting any option"
                >
                    <Text variant={multiple ? 'body' : 'bodyBold'}>
                        {multiple ? 'Cancel' : 'Close'}
                    </Text>
                </TouchableOpacity>

                {multiple && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDone}
                        accessibilityLabel="Confirm selected options and close the picker"
                        accessibilityHint="Confirming selected options will close the picker"
                    >
                        <Text variant="bodyBold">Done</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* On iOS the modal effect will reveal the black root background */}
            {Platform.OS === 'ios' && <StatusBar />}
        </SafeAreaView>
    )
}

type ListItemProps = {
    label: string
    value: string
    multiple: boolean
    checked: boolean
    onOptionSelect: (value: string) => void
}

const ListItem = memo(({ multiple, label, value, checked, onOptionSelect }: ListItemProps) => {
    return (
        <View style={styles.listItemWrapper}>
            {multiple ?
                <Checkbox
                    label={label}
                    checked={checked}
                    value={value}
                    onChange={() => onOptionSelect(value)}
                />
            :   <Radio
                    label={label}
                    checked={checked}
                    value={value}
                    onChange={() => onOptionSelect(value)}
                />
            }
        </View>
    )
})

ListItem.displayName = 'ListItem'

function ListHeader({
    label,
    searchTerm,
    numSelected,
    onSearch,
    onClearOption,
}: {
    label: string
    searchTerm: string
    numSelected: number
    onSearch: (s: string) => void
    onClearOption: () => void
}) {
    return (
        <View style={styles.listHeaderWrapper}>
            <Stack axis="y" spacing="default">
                <SearchField
                    value={searchTerm}
                    onChange={onSearch}
                    accessibilityLabel="Search options"
                    accessibilityHint="Type to search and filter options"
                />

                <Stack axis="x" spacing="sm" align="center" justify="between">
                    <Text
                        variant="bodySmallSemiBold"
                        color="text"
                        numberOfLines={1}
                        style={{ flex: 1 }}
                    >
                        {label}
                    </Text>

                    {numSelected > 1 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={onClearOption}
                            accessibilityLabel="Clear selected options"
                            accessibilityHint="Double tap to clear selected options"
                        >
                            <Text variant="detail" color="textMuted">
                                Clear selected ({numSelected})
                            </Text>
                        </TouchableOpacity>
                    )}
                </Stack>
            </Stack>
        </View>
    )
}

function ListEmpty({ children }: { children?: ReactNode }) {
    return (
        <View style={styles.listEmptyWrapper}>
            {children || (
                <Stack axis="y" spacing="default">
                    <Text align="center">No results found.</Text>
                    <Text align="center">Try changing your search term.</Text>
                </Stack>
            )}
        </View>
    )
}

function ListSeparator() {
    return <Spacer axis="y" size="default" />
}

const styles = StyleSheet.create(theme => ({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.bg,
    },
    listEmptyWrapper: {
        padding: theme.space.lg,
    },
    listHeaderWrapper: {
        marginBottom: theme.space.sm,
        padding: theme.space.default,
        backgroundColor: theme.colors.bg,
        borderBottomWidth: 1,
        borderColor: theme.colors.line3,
        ...theme.utils.flexCenter,
    },
    clearButton: {
        alignSelf: 'flex-end',
    },
    listItemWrapper: {
        paddingHorizontal: theme.space.sm,
    },
    footer: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: theme.colors.line3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    actionButton: {
        padding: theme.space.default,
        ...theme.utils.flexCenter,
    },
}))
