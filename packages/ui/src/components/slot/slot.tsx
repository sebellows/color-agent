// import * as React from 'react';

import { createSlot } from './create-slot'

const Slot = {
    Pressable: createSlot('Pressable'),
    View: createSlot('View'),
    Text: createSlot('Text'),
    Image: createSlot('Image'),
}
export { Slot }
// const Pressable = createSlot('Pressable')

// const View = createSlot('View')

// const Text = createSlot('Text')

// const Image = createSlot('Image')

// export { Image, Pressable, Text, View }
