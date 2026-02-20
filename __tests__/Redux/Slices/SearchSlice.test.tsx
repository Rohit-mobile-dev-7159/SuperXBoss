import reducer, { addRecentSearch, removeRecentSearch, clearRecentSearch } from "../../../src/Redux/Slices/searchSlice";

describe('searchSlice', () => {
    it('should return the initial state', () => {
        const state = reducer(undefined, { type: 'unknown' });
        expect(state).toEqual({
            recentSearches: [],
        });
    });

    it('should handle addRecentSearch', () => {
        const previousState = { recentSearches: [] };
        const newState = reducer(previousState, addRecentSearch({ _id: '1', name: 'Test Search' }));
        expect(newState.recentSearches).toEqual([{ _id: '1', name: 'Test Search' }]);
    });
    it('should handle removeRecentSearch', () => {
        const previousState = { recentSearches: [{ _id: '1', name: 'Test Search' }] };
        const newState = reducer(previousState, removeRecentSearch('1'));
        expect(newState.recentSearches).toEqual([]);
    });

    it('should handle clearRecentSearch', () => {
        const previousState = { recentSearches: [{ _id: '1', name: 'Test Search' }] };
        const newState = reducer(previousState, clearRecentSearch());
        expect(newState.recentSearches).toEqual([]);
    });
});