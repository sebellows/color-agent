// import * as React from 'react';

import { createSlot, Pressable } from './create-slot'

const Slot = {
    // Pressable,
    Pressable: createSlot('Pressable'),
    View: createSlot('View'),
    Text: createSlot('Text'),
    Image: createSlot('Image'),
}
export { Slot }
