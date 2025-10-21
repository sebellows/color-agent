import { Linking } from 'react-native'

import { showToast } from '../components/toaster'

type LaunchUrlParams = {
    url: string
    type?: string
    message?: string
    title?: string
    errorMessage?: string
}

export async function launchUrl({
    url,
    type = 'website',
    message = 'Please try again later.',
    title,
    errorMessage = 'Something went wrong',
}: LaunchUrlParams) {
    try {
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            Linking.openURL(url).catch(error => {
                console.log('> Failed to open url', error)
            })
        } else {
            console.log('> no support for url')

            showToast({
                title: title ?? `Cannot open ${type}`,
                subtitle: message,
                type: 'error',
            })
        }
    } catch (error) {
        console.log('> Cannot open url', error)
        showToast({ title: errorMessage, type: 'error' })
    }
}

export function phonecall(number: string, type: string = 'phone app') {
    const url = `tel:${number}`
    launchUrl({ url, type })
}
