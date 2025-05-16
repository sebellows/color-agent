// NOTE: To make each color array even, a nearest-white and nearest-black have
// been added to the standard 11 shades seen in libraries like Tailwind. The
// reasoning is so our "white" and "black" aren't separate colors floating off
// in config land.
export default {
    neutral: [
        'oklch(99.0% 0.002 247.022)', // #fbfcfd, white
        'oklch(98.4% 0.003 247.858)', // this is `color-*-50` in Tailwind land
        'oklch(96.8% 0.007 247.896)',
        'oklch(92.9% 0.013 255.508)',
        'oklch(86.9% 0.022 252.894)',
        'oklch(70.4% 0.04 256.788)',
        'oklch(55.4% 0.046 257.417)',
        'oklch(44.6% 0.043 257.281)',
        'oklch(37.2% 0.044 257.287)',
        'oklch(27.9% 0.041 260.031)',
        'oklch(20.8% 0.042 265.755)',
        'oklch(12.9% 0.042 264.695)', // this is `color-*-950` in Tailwind land
        'oklch(12.0% 0.03 260.011)', // #020511, black
    ],

    violet: [
        'oklch(99.0% 0.002 292.616)', // #fcfbfd, near-white
        'oklch(96.9% 0.016 293.756)',
        'oklch(94.3% 0.029 294.588)',
        'oklch(89.4% 0.057 293.283)',
        'oklch(81.1% 0.111 293.571)',
        'oklch(70.2% 0.183 293.541)',
        'oklch(60.6% 0.25 292.717)',
        'oklch(54.1% 0.281 293.009)',
        'oklch(49.1% 0.27 292.581)',
        'oklch(43.2% 0.232 292.759)',
        'oklch(38% 0.189 293.745)',
        'oklch(28.3% 0.141 291.089)',
        'oklch(12.0% 0.03 290.009)', // ##060410, near-black
    ],

    orange: [
        'oklch(99.0% 0.002 70.292)', // #fefbf8, near-white
        'oklch(98% 0.016 73.684)',
        'oklch(95.4% 0.038 75.164)',
        'oklch(90.1% 0.076 70.697)',
        'oklch(83.7% 0.128 66.29)',
        'oklch(75% 0.183 55.934)',
        'oklch(70.5% 0.213 47.604)',
        'oklch(64.6% 0.222 41.116)',
        'oklch(55.3% 0.195 38.402)',
        'oklch(47% 0.157 37.304)',
        'oklch(40.8% 0.123 38.172)',
        'oklch(26.6% 0.079 36.259)',
        'oklch(12.0% 0.03 36.001)', // #0f0301, near-black
    ],

    amber: [
        'oklch(99.0% 0.002 93.055)', // near-white
        'oklch(98.7% 0.022 95.277)',
        'oklch(96.2% 0.059 95.617)',
        'oklch(92.4% 0.12 95.746)',
        'oklch(87.9% 0.169 91.605)',
        'oklch(82.8% 0.189 84.429)',
        'oklch(76.9% 0.188 70.08)',
        'oklch(66.6% 0.179 58.318)',
        'oklch(55.5% 0.163 48.998)',
        'oklch(47.3% 0.137 46.201)',
        'oklch(41.4% 0.112 45.904)',
        'oklch(27.9% 0.077 45.635)',
        'oklch(12.0% 0.03 45.635)', // #0e0300, near-black
    ],

    emerald: [
        'oklch(99.0% 0.002 162.55)', // near-white
        'oklch(97.9% 0.021 166.113)',
        'oklch(95% 0.052 163.051)',
        'oklch(90.5% 0.093 164.15)',
        'oklch(84.5% 0.143 164.978)',
        'oklch(76.5% 0.177 163.223)',
        'oklch(69.6% 0.17 162.48)',
        'oklch(59.6% 0.145 163.225)',
        'oklch(50.8% 0.118 165.612)',
        'oklch(43.2% 0.095 166.913)',
        'oklch(37.8% 0.077 168.94)',
        'oklch(26.2% 0.051 172.552)',
        'oklch(12.0% 0.03 170.055)', // #000904, near-black
    ],

    rose: [
        'oklch(99.0% 0.002 16.292)', // near-white
        'oklch(96.9% 0.015 12.422)',
        'oklch(94.1% 0.03 12.58)',
        'oklch(89.2% 0.058 10.001)',
        'oklch(81% 0.117 11.638)',
        'oklch(71.2% 0.194 13.428)',
        'oklch(64.5% 0.246 16.439)',
        'oklch(58.6% 0.253 17.585)',
        'oklch(51.4% 0.222 16.935)',
        'oklch(45.5% 0.188 13.697)',
        'oklch(41% 0.159 10.272)',
        'oklch(27.1% 0.105 12.094)',
        'oklch(12.0% 0.03 10.001)', // #0f0204, near-black
    ],
}
