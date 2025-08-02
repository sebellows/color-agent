import { View } from "react-native-css/components/View";
import {
  act,
  registerCSS,
  render,
  screen,
  testID,
} from "react-native-css/jest";

test("should update styles", () => {
  registerCSS(`
    .my-class {
      color: red;
    }
  `);

  render(<View testID={testID} className="my-class" />);

  expect(screen.getByTestId(testID).props.style).toStrictEqual({
    color: "#f00",
  });

  act(() => {
    registerCSS(`
      .my-class {
        color: blue;
      }
    `);
  });

  expect(screen.getByTestId(testID).props.style).toStrictEqual({
    color: "#00f",
  });
});
