
function parseType(value) {
    const validTypes = ['work', 'home', 'personal'];

    if (validTypes.includes(value)) {
        return value;
    }
    return undefined;
}

function parseIsFavourite(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return undefined;
}

export function parseFilterParams(query) {
    const { type, isFavourite } = query;


    const parsedIsFavourite = parseIsFavourite(isFavourite);
    const parsedType = parseType(type);

    return {
        contactType: parsedType,
        isFavourite: parsedIsFavourite
    };
}


