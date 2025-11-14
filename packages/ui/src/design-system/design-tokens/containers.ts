const containers = {
    '3xs': 256,
    '2xs': 288,
    xs: 320,
    sm: 384,
    md: 448,
    lg: 512,
    xl: 576,
    '2xl': 672,
    '3xl': 768,
    '4xl': 896,
    '5xl': 1024,
    '6xl': 1152,
    '7xl': 1280,
    wide: 1536,
    hd: 1920,
}

type ContainerSizes = typeof containers
type ContainerToken = keyof ContainerSizes

export { containers, type ContainerToken }
