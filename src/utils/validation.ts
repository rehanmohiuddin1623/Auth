
export const queryValidator = ({ fields = [] }: { fields: Array<{ value: string | number, isRequired: boolean, instance: string | number, comparableVal?: string }> }) => {
    let isValid = false
    fields.forEach(({ isRequired, instance, value, comparableVal }) => {
        console.log("Validator Fileds ", {isRequired, instance, value, comparableVal})

        if (isRequired && (typeof value === "number" && !isNaN(value)) || (typeof value === "string" && value.length)) {
            isValid = typeof value === instance
        }
        if (comparableVal) {
            isValid = comparableVal.length > 0 && typeof value === typeof comparableVal && value === comparableVal
        }
    })
    return isValid

}