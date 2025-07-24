export const cssHeaderWithImports = `/**\n * This file is auto-generated from the theme tokens.\n */
    
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@custom-variant fixed (&:is(.layout-fixed *));\n\n
`

/**
 * This template contains additional global styles borrowed from
 * Shadcn UI and their Tailwind setup.
 * @see {@link https://github.com/shadcn-ui/ui/blob/main/apps/v4/styles/globals.css}
 */
export const tailwindDirectiveStyles = `
@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    ::selection {
        @apply bg-selection text-selection-foreground;
    }
    html {
        @apply scroll-smooth;
    }
    body {
        font-synthesis-weight: none;
        text-rendering: optimizeLegibility;
    }

    @supports (font: -apple-system-body) and (-webkit-appearance: none) {
        [data-wrapper] {
            @apply min-[1800px]:border-t;
        }
    }

    a:active,
    button:active {
        @apply opacity-60 md:opacity-100;
    }
}

@utility border-grid {
    @apply border-border/50 dark:border-border;
}

@utility section-soft {
    @apply from-background to-surface/40 dark:bg-background 3xl:fixed:bg-none bg-gradient-to-b;
}

@utility theme-container {
    @apply font-sans;
}

@utility container-wrapper {
    @apply 3xl:fixed:max-w-[calc(var(--breakpoint-2xl)+2rem)] mx-auto w-full px-2;
}

@utility container {
    @apply 3xl:max-w-screen-2xl mx-auto max-w-[1400px] px-4 lg:px-8;
}

@utility no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

@utility border-ghost {
    @apply after:border-border relative after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten;
}

@utility step {
    counter-increment: step;
    @apply relative;

    &:before {
        @apply text-muted-foreground right-0 mr-2 hidden size-7 items-center justify-center rounded-full text-center -indent-px font-mono text-sm font-medium md:absolute;
        content: counter(step);
    }
}

@utility extend-touch-target {
    @media (pointer: coarse) {
        @apply relative touch-manipulation after:absolute after:-inset-2;
    }
}

@layer components {
    .steps {
        &:first-child {
            @apply !mt-0;
        }

        &:first-child > h3:first-child {
            @apply !mt-0;
        }

        > h3 {
            @apply !mt-16;
        }

        > h3 + p {
            @apply !mt-2;
        }
    }

    [data-rehype-pretty-code-figure] {
        background-color: var(--color-code);
        color: var(--color-code-foreground);
        border-radius: var(--radius-lg);
        border-width: 0px;
        border-color: var(--border);
        margin-top: calc(var(--spacing) * 6);
        overflow: hidden;
        font-size: var(--text-sm);
        outline: none;
        position: relative;
        @apply md:-mx-1;

        &:has([data-rehype-pretty-code-title]) [data-slot="copy-button"] {
            top: calc(var(--spacing) * 1.5) !important;
        }
    }

    [data-rehype-pretty-code-title] {
        border-bottom: color-mix(in oklab, var(--border) 30%, transparent);
        border-bottom-width: 1px;
        border-bottom-style: solid;
        padding-block: calc(var(--spacing) * 2.5);
        padding-inline: calc(var(--spacing) * 4);
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--color-code-foreground);
    }

    [data-line-numbers] {
        display: grid;
        min-width: 100%;
        white-space: pre;
        border: 0;
        background: transparent;
        padding: 0;
        counter-reset: line;
        box-decoration-break: clone;
    }

    [data-line-numbers] [data-line]::before {
        font-size: var(--text-sm);
        counter-increment: line;
        content: counter(line);
        display: inline-block;
        width: calc(var(--spacing) * 16);
        padding-right: calc(var(--spacing) * 6);
        text-align: right;
        color: var(--color-code-number);
        background-color: var(--color-code);
        position: sticky;
        left: 0;
    }

    [data-line-numbers] [data-highlighted-line][data-line]::before {
        background-color: var(--color-code-highlight);
    }

    [data-line] {
        padding-top: calc(var(--spacing) * 0.5);
        padding-bottom: calc(var(--spacing) * 0.5);
        min-height: calc(var(--spacing) * 1);
        width: 100%;
        display: inline-block;
    }

    [data-line] span {
        color: var(--shiki-light);

        @variant dark {
            color: var(--shiki-dark) !important;
        }
    }

    [data-highlighted-line],
    [data-highlighted-chars] {
        position: relative;
        background-color: var(--color-code-highlight);
    }

    [data-highlighted-line] {
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            content: "";
            background-color: color-mix(
                in oklab,
                var(--muted-foreground) 50%,
                transparent
            );
        }
    }

    [data-highlighted-chars] {
        border-radius: var(--radius-sm);
        padding-inline: 0.3rem;
        padding-block: 0.1rem;
        font-family: var(--font-mono);
        font-size: 0.8rem;
    }
}
`
