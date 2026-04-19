import { test, expect } from '../fixtures';

type SortType = 'az' | 'za' | 'lohi' | 'hilo';

const stringSortCases = [
  { option: 'az' as SortType, label: 'Name (A to Z)', descending: false },
  { option: 'za' as SortType, label: 'Name (Z to A)', descending: true },
];

const priceSortCases = [
  { option: 'lohi' as SortType, label: 'Price (Low to High)', descending: false },
  { option: 'hilo' as SortType, label: 'Price (High to Low)', descending: true },
];

test.describe('Product Sorting Tests', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.heading).toHaveText('Products');
  });

  test.describe('Alphabetical Sorting', () => {
    for (const { option, label, descending } of stringSortCases) {
      test(`sorts correctly by ${label}`, async ({ inventoryPage }) => {
        await inventoryPage.sortBy(option);

        const names = await inventoryPage.getAllProductNames();
        expect(names.length).toBeGreaterThan(0);

        const expectedOrder = [...names].sort((a, b) =>
          descending ? b.localeCompare(a) : a.localeCompare(b)
        );

        expect(names).toEqual(expectedOrder);
      });
    }
  });

  test.describe('Price Sorting', () => {
    for (const { option, label, descending } of priceSortCases) {
      test(`sorts correctly by ${label}`, async ({ inventoryPage }) => {
        await inventoryPage.sortBy(option);

        const prices = await inventoryPage.getAllProductPrices();
        expect(prices.length).toBeGreaterThan(0);

        const expectedOrder = [...prices].sort((a, b) =>
          descending ? b - a : a - b
        );

        expect(prices).toEqual(expectedOrder);
      });
    }
  });
});