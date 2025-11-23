import { generateCompleteDesign, DesignInput } from './server/design-engine';

const input: DesignInput = {
  discharge: 900,
  floodLevel: 100.6,
  bedSlope: 0.001,
  span: 30,
  width: 8.4,
  soilBearingCapacity: 200,
  numberOfLanes: 2,
  fck: 25,
  fy: 415,
  bedLevel: 96.47,
  loadClass: "Class AA",
};

const output = generateCompleteDesign(input);
console.log(JSON.stringify(output, null, 2));
