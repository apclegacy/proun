import { reactive, watch } from 'vue';
import paper from 'paper';

import useKeys from '@/modules/useKeys';
import drawShapes from '@/modules/drawShapes';

const State = reactive({
  Scope: {} as paper.PaperScope,
  canvas: {} as HTMLCanvasElement,
  backgroundBase64: '',
  backgroundOpacity: 100,
  BackgroundRaster: {} as paper.Raster,
});

const usePaper = () => {
  const setupPaper = () => {
    if (State.canvas) {
      State.Scope = new paper.PaperScope();
      State.Scope.setup(State.canvas);
    }
  };

  const paperBackground = () => {
    State.BackgroundRaster = new State.Scope.Raster(State.backgroundBase64);
    State.BackgroundRaster.position = State.Scope.view.center;
    State.BackgroundRaster.sendToBack();
    watch(() => State.backgroundOpacity, (opacity) => {
      State.BackgroundRaster.opacity = opacity / 100;
    });

    const {
      rectangle,
    } = drawShapes(State.Scope, State.canvas, State.BackgroundRaster);
    useKeys((shape: string) => {
      if (shape === 'rect') {
        rectangle();
      }
    });
  };

  return {
    setupPaper,
    paperState: State,
    paperBackground,
  };
};

export default usePaper;