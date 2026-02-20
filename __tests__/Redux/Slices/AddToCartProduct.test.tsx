import reducer, { addToCart, removeFromCart, incrementQty, decrementQty, clearCart, setQuantity } from "../../../src/Redux/Slices/AddToCartProduct";

describe("Cart Slice Reducer", () => {
    const initialState = {
        cartProducts: {},
    };
    it("should return the initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle addToCart", () => {
        const action = addToCart({ productId: "1", qty: 2 });
        const expectedState = {
            cartProducts: {
                "1": { qty: 2 },
            },
        };
        expect(reducer(initialState, action)).toEqual(expectedState);
    });
    it("should handle removeFromCart", () => {
        const stateWithProduct = {
            cartProducts: {
                "1": { qty: 2 },
            },
        };
        const action = removeFromCart({ productId: "1" });
        const expectedState = {
            cartProducts: {},
        };
        expect(reducer(stateWithProduct, action)).toEqual(expectedState);
    });

    it("should handle incrementQty", () => {
        const stateWithProduct = {
            cartProducts: {
                "1": { qty: 2 },
            },
        };
        const action = incrementQty({ productId: "1" });
        const expectedState = {
            cartProducts: {
                "1": { qty: 3 },
            },
        };
        expect(reducer(stateWithProduct, action)).toEqual(expectedState);
    });

    it("should handle decrementQty", () => {
        const stateWithProduct = {
            cartProducts: {
                "1": { qty: 2 },
            },
        };
        const action = decrementQty({ productId: "1" });
        const expectedState = {
            cartProducts: {
                "1": { qty: 1 },
            },
        };
        expect(reducer(stateWithProduct, action)).toEqual(expectedState);
    });

    it("should handle clearCart", () => {
        const stateWithProducts = {
            cartProducts: {
                "1": { qty: 2 },
                "2": { qty: 1 },
            },
        };
        const action = clearCart();
        const expectedState = {
            cartProducts: {},
        };
        expect(reducer(stateWithProducts, action)).toEqual(expectedState);
    });

    it("should handle setQuantity", () => {
        const stateWithProduct = {
            cartProducts: {
                "1": { qty: 2 },
            },
        };
        const action = setQuantity({ productId: "1", qty: 5 });
        const expectedState = {
            cartProducts: {
                "1": { qty: 5 },
            },
        };
        expect(reducer(stateWithProduct, action)).toEqual(expectedState);
    });
});