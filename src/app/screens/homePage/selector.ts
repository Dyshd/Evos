import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrievePopularDishes = createSelector(
  (state: AppRootState) => state.homePage,
  (homePage) => homePage.popularDishes
);

export const retrieveNewDishes = createSelector(
  selectHomePage,
  (homePage) => homePage.newDishes
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (homePage) => homePage.topUsers
);
