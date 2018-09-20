import { NativeModules, NativeEventEmitter } from 'react-native'

import Utils from './Utils'

const SystemSettingNative = NativeModules.SystemSetting

const eventEmitter = new NativeEventEmitter(SystemSettingNative)

export default class SystemSetting {

    static async getVolume(type = 'music') {
        return await SystemSettingNative.getVolume(type)
    }

    static addVolumeListener(callback) {
        return eventEmitter.addListener('EventVolume', callback)
    }

    static removeVolumeListener(listener) {
        listener && listener.remove()
    }

    static async _addListener(androidOnly, type, eventName, callback) {
        if (!androidOnly || Utils.isAndroid) {
            const result = await SystemSetting._activeListener(type)
            if (result) {
                return eventEmitter.addListener(eventName, callback)
            }
        }
        return null
    }

    static async _activeListener(name) {
        try {
            await SystemSettingNative.activeListener(name)
        } catch (e) {
            console.warn(e.message)
            return false;
        }
        return true;
    }

    static removeListener(listener) {
        listener && listener.remove()
    }

    static listenEvent(complete) {
        const listener = eventEmitter.addListener('EventEnterForeground', () => {
            listener.remove()
            complete()
        })
    }
}
