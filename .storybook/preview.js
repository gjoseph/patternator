import Snap from "snapsvg";

export const parameters = {
  // actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    grid: { cellSize: 10, cellAmount: 10, offsetX: 16, offsetY: 16 },
  },
};

export const decorators = [
  (story, context) => {
    // Not sure this is how i'm meant to use globals but this worked;
    // context.globals.getSnap = () => Snap("#svg");
    // we then had to retrieve it like so:
    //   // const [globals, _] = useGlobals();
    //   // const getSnap = globals.getSnap;
    // ... using args makes this accessible within useEffect() and simply less verbose
    context.args.getSnap = () => Snap("#svg");
    return `<svg id="svg" style="border: 1px solid #000; box-shadow: 5px 5px #666;
                                       width: calc(100vw - 32px); height: calc(100vh - 32px);"/>
      <div>${story()}</div>`;
  },
]