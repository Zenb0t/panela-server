import { Ingredient, MeasuringUnit } from "../../types/ingredient";

export const dummyIngredient: Ingredient = {
    amount: 1,
    measuringUnit: MeasuringUnit.CUP,
    name: "Flour",
    costPerUnit: 0.25,
    _id: "testId"
}

export const dummyIngredients: Ingredient[] = [
    {
        amount: 1,
        measuringUnit: MeasuringUnit.CUP,
        name: "Flour",
        costPerUnit: 0.25,
        _id: "testId1"
    },
    {
        amount: 1,
        measuringUnit: MeasuringUnit.CUP,
        name: "Sugar",
        costPerUnit: 0.25,
        _id: "testId2"
    },
    {
        amount: 1,
        measuringUnit: MeasuringUnit.CUP,
        name: "Eggs",
        costPerUnit: 0.25,
        _id: "testId3"
    },
]