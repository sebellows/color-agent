// NOTE: To make each color array even, a nearest-white and nearest-black have
// been added to the standard 11 shades seen in libraries like Tailwind. The
// reasoning is so our "white" and "black" aren't separate colors floating off
// in config land.
export default {
    neutral: [
        'hsla(240, 3%, 99%, 1)', // white
        'hsla(240, 5%, 96%, 1)',
        'hsla(240, 5%, 94%, 1)',
        'hsla(218, 13%, 91%, 1)',
        'hsla(220, 13%, 84%, 1)',
        'hsla(227, 14%, 69%, 1)',
        'hsla(229, 12%, 53%, 1)',
        'hsla(229, 11%, 43%, 1)',
        'hsla(230, 15%, 35%, 1)',
        'hsla(231, 17%, 27%, 1)',
        'hsla(233, 19%, 20%, 1)',
        'hsla(232, 21%, 12%, 1)', // #040817
        'hsla(228, 79%, 4%, 1)', // #020511 black
    ],

    violet: [
        'hsla(262, 100%, 99%, 1)', // near-white
        'hsla(268, 100%, 97%, 1)',
        'hsla(274, 100%, 92%, 1)',
        'hsla(272, 100%, 88%, 1)',
        'hsla(270, 78%, 80%, 1)',
        'hsla(270, 70%, 71%, 1)',
        'hsla(267, 70%, 60%, 1)',
        'hsla(268, 57%, 55%, 1)',
        'hsla(267, 47%, 50%, 1)',
        'hsla(267, 39%, 43%, 1)',
        'hsla(268, 30%, 38%, 1)',
        'hsla(265, 32%, 28%, 1)',
        'hsla(262, 28%, 18%, 1)', // near-black
    ],

    orange: [
        'hsla(46, 100%, 99%, 1)', // near-white
        'hsla(48, 100%, 96%, 1)',
        'hsla(49, 100%, 93%, 1)',
        'hsla(45, 93%, 87%, 1)',
        'hsla(39, 90%, 80%, 1)',
        'hsla(29, 97%, 72%, 1)',
        'hsla(21, 90%, 68%, 1)',
        'hsla(15, 84%, 62%, 1)',
        'hsla(14, 74%, 52%, 1)',
        'hsla(13, 65%, 44%, 1)',
        'hsla(14, 50%, 38%, 1)',
        'hsla(13, 47%, 24%, 1)',
        'hsla(9, 30%, 12%, 1)', // near-black
    ],

    amber: [
        'hsla(48, 100%, 99%, 1)', // near-white
        'hsla(48, 100%, 96%, 1)',
        'hsla(48, 100%, 93%, 1)',
        'hsla(48, 97%, 89%, 1)',
        'hsla(45, 94%, 84%, 1)',
        'hsla(38, 92%, 79%, 1)',
        'hsla(31, 85%, 73%, 1)',
        'hsla(23, 79%, 63%, 1)',
        'hsla(18, 76%, 52%, 1)',
        'hsla(17, 67%, 44%, 1)',
        'hsla(17, 55%, 39%, 1)',
        'hsla(17, 47%, 26%, 1)',
        'hsla(17, 35%, 12%, 1)', // near-black
    ],

    emerald: [
        'hsla(152, 100%, 99%, 1)', // near-white
        'hsla(152, 81%, 96%, 1)',
        'hsla(149, 80%, 92%, 1)',
        'hsla(152, 76%, 87%, 1)',
        'hsla(156, 72%, 82%, 1)',
        'hsla(154, 69%, 74%, 1)',
        'hsla(152, 60%, 67%, 1)',
        'hsla(153, 51%, 57%, 1)',
        'hsla(157, 50%, 48%, 1)',
        'hsla(158, 46%, 40%, 1)',
        'hsla(161, 47%, 35%, 1)',
        'hsla(167, 47%, 24%, 1)',
        'hsla(165, 40%, 12%, 1)', // near-black
    ],

    rose: [
        'hsla(10, 100%, 99%, 1)', // near-white
        'hsla(10, 100%, 96%, 1)',
        'hsla(10, 100%, 92%, 1)',
        'hsla(8, 100%, 87%, 1)',
        'hsla(9, 100%, 81%, 1)',
        'hsla(358, 91%, 73%, 1)',
        'hsla(0, 84%, 65%, 1)',
        'hsla(358, 75%, 59%, 1)',
        'hsla(357, 66%, 51%, 1)',
        'hsla(354, 65%, 45%, 1)',
        'hsla(350, 63%, 40%, 1)',
        'hsla(351, 55%, 26%, 1)',
        'hsla(351, 36%, 14%, 1)', // near-black
    ],
}
