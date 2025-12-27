export interface ThemeSettings {
    themeColors?: {
        primary?: string
        primaryForeground?: string
        secondary?: string
        secondaryForeground?: string
        background?: string
        foreground?: string
        card?: string
        cardForeground?: string
        muted?: string
        mutedForeground?: string
        otherColors?: {
            border?: string
            ring?: string
            destructive?: string
            destructiveForeground?: string
        }
        darkModeColors?: {
            darkPrimary?: string
            darkSecondary?: string
            darkBackground?: string
            darkForeground?: string
            darkCard?: string
            darkCardForeground?: string
        }
    }
    branding?: {
        colors?: {
            light: {
                primary?: string
                secondary?: string
                background?: string
                foreground?: string
            }
            dark: {
                primary?: string
                secondary?: string
                background?: string
                foreground?: string
            }
        }
    }
    typography?: {
        fontFamily?: string
        headingFontFamily?: string
        borderRadius?: string
        fontHeading?: string
        fontBody?: string
    }
}

/**
 * Converte cores para o formato HSL aceito pelo Shadcn/UI se necessário,
 * ou retorna o valor original se já for compatível.
 * Nota: Shadcn usa H S L (espaçados) em variáveis CSS.
 */
function hexToHSLVariables(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex

    let r = 0, g = 0, b = 0
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
    }

    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function generateCSSVariables(settings: ThemeSettings): string {
    if (!settings) return ''

    const branding = settings.branding
    const colors = settings.themeColors
    const typography = settings.typography

    let css = ':root {\n'

    // Light Mode Colors
    const light = branding?.colors?.light || colors
    if (light) {
        if (light.primary) css += `  --primary: ${hexToHSLVariables(light.primary)};\n`
        if (light.secondary || (light as any).secondary) css += `  --secondary: ${hexToHSLVariables(light.secondary || (light as any).secondary)};\n`
        if (light.background) css += `  --background: ${hexToHSLVariables(light.background)};\n`
        if (light.foreground) css += `  --foreground: ${hexToHSLVariables(light.foreground)};\n`
    }

    // Typography & Border Radius
    if (typography) {
        if (typography.borderRadius) css += `  --radius: ${typography.borderRadius};\n`
        if (typography.fontHeading) css += `  --font-heading: '${typography.fontHeading}', ui-sans-serif, system-ui;\n`
        if (typography.fontBody) css += `  --font-body: '${typography.fontBody}', ui-sans-serif, system-ui;\n`
    }

    css += '}\n\n'

    // Dark Mode Colors
    const dark = branding?.colors?.dark || colors?.darkModeColors
    if (dark) {
        css += '.dark {\n'
        if ((dark as any).primary || (dark as any).darkPrimary) css += `  --primary: ${hexToHSLVariables((dark as any).primary || (dark as any).darkPrimary)};\n`
        if ((dark as any).secondary || (dark as any).darkSecondary) css += `  --secondary: ${hexToHSLVariables((dark as any).secondary || (dark as any).darkSecondary)};\n`
        if ((dark as any).background || (dark as any).darkBackground) css += `  --background: ${hexToHSLVariables((dark as any).background || (dark as any).darkBackground)};\n`
        if ((dark as any).foreground || (dark as any).darkForeground) css += `  --foreground: ${hexToHSLVariables((dark as any).foreground || (dark as any).darkForeground)};\n`
        css += '}\n'
    }

    return css
}
