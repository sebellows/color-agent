// NOTE: To make each color array even, a nearest-white and nearest-black have
// been added to the standard 11 shades seen in libraries like Tailwind. The
// reasoning is so our "white" and "black" aren't separate colors floating off
// in config land.

export const rawColorPalette = {
    slate: [
        [99.0, 0.002, 247.022], // #fbfcfd, white
        [98.4, 0.003, 247.858], // this is `color-*-50` in Tailwind land
        [96.8, 0.007, 247.896],
        [92.9, 0.013, 255.508],
        [86.9, 0.022, 252.894],
        [70.4, 0.04, 256.788],
        [55.4, 0.046, 257.417],
        [44.6, 0.043, 257.281],
        [37.2, 0.044, 257.287],
        [27.9, 0.041, 260.031],
        [20.8, 0.042, 265.755],
        [12.9, 0.042, 264.695], // this is `color-*-950` in Tailwind land
        [12.0, 0.03, 260.011], // #020511, black
    ] as Array<[number, number, number]>,
    violet: [
        [99.0, 0.002, 292.616], // #fcfbfd, near-white
        [96.9, 0.016, 293.756],
        [94.3, 0.029, 294.588],
        [89.4, 0.057, 293.283],
        [81.1, 0.111, 293.571],
        [70.2, 0.183, 293.541],
        [60.6, 0.25, 292.717],
        [54.1, 0.281, 293.009],
        [49.1, 0.27, 292.581],
        [43.2, 0.232, 292.759],
        [38.0, 0.189, 293.745],
        [28.3, 0.141, 291.089],
        [12.0, 0.03, 290.009], // ##060410, near-black
    ] as Array<[number, number, number]>,

    orange: [
        [99.0, 0.002, 70.292], // #fefbf8, near-white
        [98.0, 0.016, 73.684],
        [95.4, 0.038, 75.164],
        [90.1, 0.076, 70.697],
        [83.7, 0.128, 66.29],
        [75.0, 0.183, 55.934],
        [70.5, 0.213, 47.604],
        [64.6, 0.222, 41.116],
        [55.3, 0.195, 38.402],
        [47.0, 0.157, 37.304],
        [40.8, 0.123, 38.172],
        [26.6, 0.079, 36.259],
        [12.0, 0.03, 36.001], // #0f0301, near-black
    ] as Array<[number, number, number]>,

    amber: [
        [99.0, 0.002, 93.055], // near-white
        [98.7, 0.022, 95.277],
        [96.2, 0.059, 95.617],
        [92.4, 0.12, 95.746],
        [87.9, 0.169, 91.605],
        [82.8, 0.189, 84.429],
        [76.9, 0.188, 70.08],
        [66.6, 0.179, 58.318],
        [55.5, 0.163, 48.998],
        [47.3, 0.137, 46.201],
        [41.4, 0.112, 45.904],
        [27.9, 0.077, 45.635],
        [12.0, 0.03, 45.635], // #0e0300, near-black
    ] as Array<[number, number, number]>,

    emerald: [
        [99.0, 0.002, 162.55], // near-white
        [97.9, 0.021, 166.113],
        [95.0, 0.052, 163.051],
        [90.5, 0.093, 164.15],
        [84.5, 0.143, 164.978],
        [76.5, 0.177, 163.223],
        [69.6, 0.17, 162.48],
        [59.6, 0.145, 163.225],
        [50.8, 0.118, 165.612],
        [43.2, 0.095, 166.913],
        [37.8, 0.077, 168.94],
        [26.2, 0.051, 172.552],
        [12.0, 0.03, 170.055], // #000904, near-black
    ] as Array<[number, number, number]>,

    rose: [
        [99.0, 0.002, 16.292], // near-white
        [96.9, 0.015, 12.422],
        [94.1, 0.03, 12.58],
        [89.2, 0.058, 10.001],
        [81.0, 0.117, 11.638],
        [71.2, 0.194, 13.428],
        [64.5, 0.246, 16.439],
        [58.6, 0.253, 17.585],
        [51.4, 0.222, 16.935],
        [45.5, 0.188, 13.697],
        [41.0, 0.159, 10.272],
        [27.1, 0.105, 12.094],
        [12.0, 0.03, 10.001], // #0f0204, near-black
    ] as Array<[number, number, number]>,
}
