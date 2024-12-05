/**
 * Deeply merge two objects
 * @param target 
 * @param source 
 * @returns targetCopy
 */
// Cette fonction `deepMerge` fusionne de manière récursive deux objets.
// Elle prend un objet cible et un objet source, et combine leurs propriétés.
export function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
    // Vérifie si la cible ou la source est un tableau, une carte ou un ensemble.
    // Dans ce cas, retourne simplement la source.
    if (Array.isArray(target) || target instanceof Map || target instanceof Set) return source;
    if (Array.isArray(source) || source instanceof Map || source instanceof Set) return target;

    // Vérifie que la cible est un objet non nul.
    if (typeof target !== 'object' || target === null) {
        throw new TypeError('Target must be a non-null object');
    }
    
    // Vérifie que la source est un objet non nul.
    if (typeof source !== 'object' || source === null) {
        throw new TypeError('Source must be a non-null object');
    }

    // Crée une copie de l'objet cible pour éviter de le modifier directement.
    const targetCopy = { ...target };

    // Copie les propriétés de l'objet cible dans la copie.
    for (const key of Object.keys(target)) {
        if (Object.hasOwn(target, key)) { // Évite le poisoning du prototype
            targetCopy[key] = target[key];
        }
    }

    // Fusionne les propriétés de l'objet source dans la copie de l'objet cible.
    for (const key of Object.keys(source)) {
        const targetValue = targetCopy[key]; // Valeur actuelle de la cible pour la clé
        const sourceValue = source[key]; // Valeur de la source pour la clé

        if (Object.hasOwn(source, key)) {
            // Si la valeur de la source est un objet, fusionne récursivement.
            if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
                // Si la valeur cible n'est pas un objet, initialise comme un objet vide.
                if (typeof targetValue !== 'object' || targetValue === null) {
                    targetCopy[key] = {}; // Initialisation de l'objet vide
                }
                // Appel récursif pour fusionner les objets.
                targetCopy[key] = deepMerge(targetCopy[key], sourceValue);
            } else {
                // Sinon, remplace simplement la valeur cible par la valeur source.
                targetCopy[key] = sourceValue;
            }
        }
    }
    
    // Retourne l'objet cible fusionné.
    return targetCopy;
}