import {
  ErrorModel,
  BeltDefaultForwardInternalVariant_Layer0,
  BeltDefaultForwardInternalVariant_Layer1,
  BeltDefaultForwardInternalVariant_Layer2,
  BeltDefaultLeftInternalVariant_Layer0,
  BeltDefaultLeftInternalVariant_Layer1,
  BeltDefaultLeftInternalVariant_Layer2,
  Splitter1To2LInternalVariant_Layer0,
  Splitter1To2LInternalVariant_Layer1,
  Splitter1To2LInternalVariant_Layer2,
  BeltPortSenderInternalVariant,
  BeltPortReceiverInternalVariant,
  SplitterTShapeInternalVariant_Layer0,
  SplitterTShapeInternalVariant_Layer1,
  SplitterTShapeInternalVariant_Layer2,
  Splitter1To3InternalVariant_Layer0,
  Splitter1To3InternalVariant_Layer1,
  Splitter1To3InternalVariant_Layer2,
  Merger2To1LInternalVariant_Layer0,
  Merger2To1LInternalVariant_Layer1,
  Merger2To1LInternalVariant_Layer2,
  MergerTShapeInternalVariant_Layer0,
  MergerTShapeInternalVariant_Layer1,
  MergerTShapeInternalVariant_Layer2,
  Merger3To1InternalVariant_Layer0,
  Merger3To1InternalVariant_Layer1,
  Merger3To1InternalVariant_Layer2,
  Lift1UpForwardInternalVariant_Layer0,
  Lift1UpForwardInternalVariant_Layer1,
  Lift1UpLeftInternalVariant_Layer0,
  Lift1UpLeftInternalVariant_Layer1,
  Lift1UpBackwardInternalVariant_Layer0,
  Lift1UpBackwardInternalVariant_Layer1,
  Lift1DownForwardInternalVariant_Layer0,
  Lift1DownForwardInternalVariant_Layer1,
  Lift1DownLeftInternalVariant_Layer0,
  Lift1DownLeftInternalVariant_Layer1,
  Lift1DownBackwardInternalVariant_Layer0,
  Lift1DownBackwardInternalVariant_Layer1,
  Lift2UpForwardInternalVariant,
  Lift2UpLeftInternalVariant,
  Lift2UpBackwardInternalVariant,
  Lift2DownForwardInternalVariant,
  Lift2DownLeftInternalVariant,
  Lift2DownBackwardInternalVariant,
  PipeForwardInternalVariant_Layer0,
  PipeForwardInternalVariant_Layer1,
  PipeForwardInternalVariant_Layer2,
  PipeLeftInternalVariant_Layer0,
  PipeLeftInternalVariant_Layer1,
  PipeLeftInternalVariant_Layer2,
  PipeCrossInternalVariant_Layer0,
  PipeCrossInternalVariant_Layer1,
  PipeCrossInternalVariant_Layer2,
  PipeJunctionInternalVariant_Layer0,
  PipeJunctionInternalVariant_Layer1,
  PipeJunctionInternalVariant_Layer2,
  PipeUpForwardInternalVariant_Layer0,
  PipeUpForwardInternalVariant_Layer1,
  PipeUpLeftInternalVariant_Layer0,
  PipeUpLeftInternalVariant_Layer1,
  PipeUpBackwardInternalVariant_Layer0,
  PipeUpBackwardInternalVariant_Layer1,
  Pipe2UpForwardInternalVariant,
  Pipe2UpLeftInternalVariant,
  Pipe2UpBackwardInternalVariant,
  PipeGateDefaultInternalVariant,
  FluidPortSenderInternalVariant,
  FluidPortReceiverInternalVariant,
  WireDefaultForwardInternalVariant,
  WireDefaultLeftInternalVariant,
  WireDefault1UpForwardInternalVariant,
  WireDefault1UpBackwardInternalVariant,
  WireDefault1UpLeftInternalVariant,
  WireDefault2UpForwardInternalVariant,
  WireDefault2UpBackwardInternalVariant,
  WireDefault2UpLeftInternalVariant,
  WireDefaultJunctionInternalVariant,
  WireDefaultCrossInternalVariant,
  WireDefaultBridgeInternalVariant,
  WireTransmitterSenderInternalVariant,
  WireTransmitterReceiverInternalVariant,
  WireGlobalTransmitterSenderInternalVariant,
  WireGlobalTransmitterReceiverInternalVariant,
  LogicGateAndInternalVariant,
  LogicGateNotInternalVariant,
  LogicGateOrInternalVariant,
  LogicGateXOrInternalVariant,
  LogicGateCompareInternalVariant,
  LogicGateIfInternalVariant,
  VirtualAnalyzerDefaultInternalVariant,
  VirtualRotatorDefaultInternalVariant,
  VirtualHalfCutterDefaultInternalVariant,
  VirtualHalvesSwapperDefaultInternalVariant,
  VirtualStackerDefaultInternalVariant,
  VirtualUnstackerDefaultInternalVariant,
  VirtualPainterDefaultInternalVariant,
  VirtualCrystalGeneratorDefaultInternalVariant,
  VirtualPinPusherDefaultInternalVariant,
  BeltFilterDefaultInternalVariant,
  BeltReaderDefaultInternalVariant,
  DisplayDefaultInternalVariant,
  ConstantSignalDefaultInternalVariant,
  ButtonDefaultInternalVariant,
  SandboxItemProducerDefaultInternalVariant,
  SandboxFluidProducerDefaultInternalVariant,
  LabelDefaultInternalVariant,
  TrashDefaultInternalVariant,
  ExtractorDefaultInternalVariant,
  RotatorOneQuadInternalVariant,
  RotatorOneQuadCCWInternalVariant,
  RotatorHalfInternalVariant,
  CutterDefaultInternalVariant,
  CutterHalfInternalVariant,
  HalvesSwapperDefaultInternalVariant,
  StackerDefaultInternalVariant,
  StackerStraightInternalVariant,
  PinPusherDefaultInternalVariant,
  PumpDefaultInternalVariant,
  PainterDefaultInternalVariant,
  MixerDefaultInternalVariant,
  FluidStorageDefaultInternalVariant,
  CrystalGeneratorDefaultInternalVariant,
} from '@shapez-vortex/models';
import type { Component } from 'svelte';
import type { BlueprintBuildingIdentifier } from '$lib/blueprint';

type BlueprintBuildingModel = {
  base: Component;
  layers?: [Component, Component, Component];
};
const BUILDINGS: Record<BlueprintBuildingIdentifier, BlueprintBuildingModel> = {
  BeltDefaultForwardInternalVariant: {
    base: BeltDefaultForwardInternalVariant_Layer0,
    layers: [
      BeltDefaultForwardInternalVariant_Layer0,
      BeltDefaultForwardInternalVariant_Layer1,
      BeltDefaultForwardInternalVariant_Layer2,
    ],
  },
  BeltDefaultLeftInternalVariant: {
    base: BeltDefaultLeftInternalVariant_Layer0,
    layers: [
      BeltDefaultLeftInternalVariant_Layer0,
      BeltDefaultLeftInternalVariant_Layer1,
      BeltDefaultLeftInternalVariant_Layer2,
    ],
  },
  BeltPortSenderInternalVariant: {
    base: BeltPortSenderInternalVariant,
  },
  BeltPortReceiverInternalVariant: {
    base: BeltPortReceiverInternalVariant,
  },
  Splitter1To2LInternalVariant: {
    base: Splitter1To2LInternalVariant_Layer0,
    layers: [
      Splitter1To2LInternalVariant_Layer0,
      Splitter1To2LInternalVariant_Layer1,
      Splitter1To2LInternalVariant_Layer2,
    ],
  },
  SplitterTShapeInternalVariant: {
    base: SplitterTShapeInternalVariant_Layer0,
    layers: [
      SplitterTShapeInternalVariant_Layer0,
      SplitterTShapeInternalVariant_Layer1,
      SplitterTShapeInternalVariant_Layer2,
    ],
  },
  Splitter1To3InternalVariant: {
    base: Splitter1To3InternalVariant_Layer0,
    layers: [
      Splitter1To3InternalVariant_Layer0,
      Splitter1To3InternalVariant_Layer1,
      Splitter1To3InternalVariant_Layer2,
    ],
  },
  Merger2To1LInternalVariant: {
    base: Merger2To1LInternalVariant_Layer0,
    layers: [
      Merger2To1LInternalVariant_Layer0,
      Merger2To1LInternalVariant_Layer1,
      Merger2To1LInternalVariant_Layer2,
    ],
  },
  MergerTShapeInternalVariant: {
    base: MergerTShapeInternalVariant_Layer0,
    layers: [
      MergerTShapeInternalVariant_Layer0,
      MergerTShapeInternalVariant_Layer1,
      MergerTShapeInternalVariant_Layer2,
    ],
  },
  Merger3To1InternalVariant: {
    base: Merger3To1InternalVariant_Layer0,
    layers: [
      Merger3To1InternalVariant_Layer0,
      Merger3To1InternalVariant_Layer1,
      Merger3To1InternalVariant_Layer2,
    ],
  },
  Lift1UpForwardInternalVariant: {
    base: Lift1UpForwardInternalVariant_Layer0,
    layers: [
      Lift1UpForwardInternalVariant_Layer0,
      Lift1UpForwardInternalVariant_Layer1,
      Lift1UpForwardInternalVariant_Layer1,
    ],
  },
  Lift1UpLeftInternalVariant: {
    base: Lift1UpLeftInternalVariant_Layer0,
    layers: [
      Lift1UpLeftInternalVariant_Layer0,
      Lift1UpLeftInternalVariant_Layer1,
      Lift1UpLeftInternalVariant_Layer1,
    ],
  },
  Lift1UpBackwardInternalVariant: {
    base: Lift1UpBackwardInternalVariant_Layer0,
    layers: [
      Lift1UpBackwardInternalVariant_Layer0,
      Lift1UpBackwardInternalVariant_Layer1,
      Lift1UpBackwardInternalVariant_Layer1,
    ],
  },
  Lift1DownForwardInternalVariant: {
    base: Lift1DownForwardInternalVariant_Layer0,
    layers: [
      Lift1DownForwardInternalVariant_Layer0,
      Lift1DownForwardInternalVariant_Layer1,
      Lift1DownForwardInternalVariant_Layer1,
    ],
  },
  Lift1DownLeftInternalVariant: {
    base: Lift1DownLeftInternalVariant_Layer0,
    layers: [
      Lift1DownLeftInternalVariant_Layer0,
      Lift1DownLeftInternalVariant_Layer1,
      Lift1DownLeftInternalVariant_Layer1,
    ],
  },
  Lift1DownBackwardInternalVariant: {
    base: Lift1DownBackwardInternalVariant_Layer0,
    layers: [
      Lift1DownBackwardInternalVariant_Layer0,
      Lift1DownBackwardInternalVariant_Layer1,
      Lift1DownBackwardInternalVariant_Layer1,
    ],
  },
  Lift2UpForwardInternalVariant: {
    base: Lift2UpForwardInternalVariant,
  },
  Lift2UpLeftInternalVariant: {
    base: Lift2UpLeftInternalVariant,
  },
  Lift2UpBackwardInternalVariant: {
    base: Lift2UpBackwardInternalVariant,
  },
  Lift2DownForwardInternalVariant: {
    base: Lift2DownForwardInternalVariant,
  },
  Lift2DownLeftInternalVariant: {
    base: Lift2DownLeftInternalVariant,
  },
  Lift2DownBackwardInternalVariant: {
    base: Lift2DownBackwardInternalVariant,
  },
  PipeForwardInternalVariant: {
    base: PipeForwardInternalVariant_Layer0,
    layers: [
      PipeForwardInternalVariant_Layer0,
      PipeForwardInternalVariant_Layer1,
      PipeForwardInternalVariant_Layer2,
    ],
  },
  PipeLeftInternalVariant: {
    base: PipeLeftInternalVariant_Layer0,
    layers: [
      PipeLeftInternalVariant_Layer0,
      PipeLeftInternalVariant_Layer1,
      PipeLeftInternalVariant_Layer2,
    ],
  },
  PipeCrossInternalVariant: {
    base: PipeCrossInternalVariant_Layer0,
    layers: [
      PipeCrossInternalVariant_Layer0,
      PipeCrossInternalVariant_Layer1,
      PipeCrossInternalVariant_Layer2,
    ],
  },
  PipeJunctionInternalVariant: {
    base: PipeJunctionInternalVariant_Layer0,
    layers: [
      PipeJunctionInternalVariant_Layer0,
      PipeJunctionInternalVariant_Layer1,
      PipeJunctionInternalVariant_Layer2,
    ],
  },
  PipeUpForwardInternalVariant: {
    base: PipeUpForwardInternalVariant_Layer0,
    layers: [
      PipeUpForwardInternalVariant_Layer0,
      PipeUpForwardInternalVariant_Layer1,
      PipeUpForwardInternalVariant_Layer1,
    ],
  },
  PipeUpLeftInternalVariant: {
    base: PipeUpLeftInternalVariant_Layer0,
    layers: [
      PipeUpLeftInternalVariant_Layer0,
      PipeUpLeftInternalVariant_Layer1,
      PipeUpLeftInternalVariant_Layer1,
    ],
  },
  PipeUpBackwardInternalVariant: {
    base: PipeUpBackwardInternalVariant_Layer0,
    layers: [
      PipeUpBackwardInternalVariant_Layer0,
      PipeUpBackwardInternalVariant_Layer1,
      PipeUpBackwardInternalVariant_Layer1,
    ],
  },
  Pipe2UpForwardInternalVariant: {
    base: Pipe2UpForwardInternalVariant,
  },
  Pipe2UpLeftInternalVariant: {
    base: Pipe2UpLeftInternalVariant,
  },
  Pipe2UpBackwardInternalVariant: {
    base: Pipe2UpBackwardInternalVariant,
  },
  PipeGateDefaultInternalVariant: {
    base: PipeGateDefaultInternalVariant,
  },
  FluidPortSenderInternalVariant: {
    base: FluidPortSenderInternalVariant,
  },
  FluidPortReceiverInternalVariant: {
    base: FluidPortReceiverInternalVariant,
  },
  WireDefaultForwardInternalVariant: {
    base: WireDefaultForwardInternalVariant,
  },
  WireDefaultLeftInternalVariant: {
    base: WireDefaultLeftInternalVariant,
  },
  WireDefaultJunctionInternalVariant: {
    base: WireDefaultJunctionInternalVariant,
  },
  WireDefaultCrossInternalVariant: {
    base: WireDefaultCrossInternalVariant,
  },
  WireDefaultBridgeInternalVariant: {
    base: WireDefaultBridgeInternalVariant,
  },
  WireDefault1UpForwardInternalVariant: {
    base: WireDefault1UpForwardInternalVariant,
  },
  WireDefault1UpLeftInternalVariant: {
    base: WireDefault1UpLeftInternalVariant,
  },
  WireDefault1UpBackwardInternalVariant: {
    base: WireDefault1UpBackwardInternalVariant,
  },
  WireDefault2UpForwardInternalVariant: {
    base: WireDefault2UpForwardInternalVariant,
  },
  WireDefault2UpLeftInternalVariant: {
    base: WireDefault2UpLeftInternalVariant,
  },
  WireDefault2UpBackwardInternalVariant: {
    base: WireDefault2UpBackwardInternalVariant,
  },
  WireTransmitterSenderInternalVariant: {
    base: WireTransmitterSenderInternalVariant,
  },
  WireTransmitterReceiverInternalVariant: {
    base: WireTransmitterReceiverInternalVariant,
  },
  WireGlobalTransmitterSenderInternalVariant: {
    base: WireGlobalTransmitterSenderInternalVariant,
  },
  WireGlobalTransmitterReceiverInternalVariant: {
    base: WireGlobalTransmitterReceiverInternalVariant,
  },
  LogicGateAndInternalVariant: {
    base: LogicGateAndInternalVariant,
  },
  LogicGateNotInternalVariant: {
    base: LogicGateNotInternalVariant,
  },
  LogicGateOrInternalVariant: {
    base: LogicGateOrInternalVariant,
  },
  LogicGateXOrInternalVariant: {
    base: LogicGateXOrInternalVariant,
  },
  LogicGateCompareInternalVariant: {
    base: LogicGateCompareInternalVariant,
  },
  LogicGateIfInternalVariant: {
    base: LogicGateIfInternalVariant,
  },
  VirtualAnalyzerDefaultInternalVariant: {
    base: VirtualAnalyzerDefaultInternalVariant,
  },
  VirtualRotatorDefaultInternalVariant: {
    base: VirtualRotatorDefaultInternalVariant,
  },
  VirtualHalfCutterDefaultInternalVariant: {
    base: VirtualHalfCutterDefaultInternalVariant,
  },
  VirtualHalvesSwapperDefaultInternalVariant: {
    base: VirtualHalvesSwapperDefaultInternalVariant,
  },
  VirtualStackerDefaultInternalVariant: {
    base: VirtualStackerDefaultInternalVariant,
  },
  VirtualUnstackerDefaultInternalVariant: {
    base: VirtualUnstackerDefaultInternalVariant,
  },
  VirtualPainterDefaultInternalVariant: {
    base: VirtualPainterDefaultInternalVariant,
  },
  VirtualCrystalGeneratorDefaultInternalVariant: {
    base: VirtualCrystalGeneratorDefaultInternalVariant,
  },
  VirtualPinPusherDefaultInternalVariant: {
    base: VirtualPinPusherDefaultInternalVariant,
  },
  BeltFilterDefaultInternalVariant: {
    base: BeltFilterDefaultInternalVariant,
  },
  BeltReaderDefaultInternalVariant: {
    base: BeltReaderDefaultInternalVariant,
  },
  ButtonDefaultInternalVariant: {
    base: ButtonDefaultInternalVariant,
  },
  ConstantSignalDefaultInternalVariant: {
    base: ConstantSignalDefaultInternalVariant,
  },
  DisplayDefaultInternalVariant: {
    base: DisplayDefaultInternalVariant,
  },
  SandboxItemProducerDefaultInternalVariant: {
    base: SandboxItemProducerDefaultInternalVariant,
  },
  SandboxFluidProducerDefaultInternalVariant: {
    base: SandboxFluidProducerDefaultInternalVariant,
  },
  LabelDefaultInternalVariant: {
    base: LabelDefaultInternalVariant,
  },
  TrashDefaultInternalVariant: {
    base: TrashDefaultInternalVariant,
  },
  ExtractorDefaultInternalVariant: {
    base: ExtractorDefaultInternalVariant,
  },
  RotatorOneQuadInternalVariant: {
    base: RotatorOneQuadInternalVariant,
  },
  RotatorOneQuadCCWInternalVariant: {
    base: RotatorOneQuadCCWInternalVariant,
  },
  RotatorHalfInternalVariant: {
    base: RotatorHalfInternalVariant,
  },
  CutterHalfInternalVariant: {
    base: CutterHalfInternalVariant,
  },
  CutterDefaultInternalVariant: {
    base: CutterDefaultInternalVariant,
  },
  HalvesSwapperDefaultInternalVariant: {
    base: HalvesSwapperDefaultInternalVariant,
  },
  StackerDefaultInternalVariant: {
    base: StackerDefaultInternalVariant,
  },
  StackerStraightInternalVariant: {
    base: StackerStraightInternalVariant,
  },
  PinPusherDefaultInternalVariant: {
    base: PinPusherDefaultInternalVariant,
  },
  PumpDefaultInternalVariant: {
    base: PumpDefaultInternalVariant,
  },
  PainterDefaultInternalVariant: {
    base: PainterDefaultInternalVariant,
  },
  MixerDefaultInternalVariant: {
    base: MixerDefaultInternalVariant,
  },
  CrystalGeneratorDefaultInternalVariant: {
    base: CrystalGeneratorDefaultInternalVariant,
  },
  FluidStorageDefaultInternalVariant: {
    base: FluidStorageDefaultInternalVariant,
  },
};

export const getBlueprintBuildingModel = (
  type: BlueprintBuildingIdentifier,
) => {
  const model = BUILDINGS[getBlueprintBuildingType(type)];
  if (!model) {
    console.error(`unknown building ${type}`);
    return {
      base: ErrorModel,
    } as BlueprintBuildingModel;
  }
  return model;
};
const getBlueprintBuildingType = (type: BlueprintBuildingIdentifier) => {
  const compatible = getCompatibleBlueprintBuildingType(type);
  const mirrored = getMirroredBlueprintBuildingType(compatible);
  return mirrored;
};
const getCompatibleBlueprintBuildingType = (
  type: BlueprintBuildingIdentifier,
) => {
  switch (type) {
    case 'BeltDefaultRightInternalVariant':
      return 'BeltDefaultLeftInternalVariantMirrored';
    case 'Splitter1To2RInternalVariant':
      return 'Splitter1To2LInternalVariantMirrored';
    case 'Merger2To1RInternalVariant':
      return 'Merger2To1LInternalVariantMirrored';
    case 'Lift1UpRightInternalVariant':
      return 'Lift1UpLeftInternalVariantMirrored';
    case 'Lift1DownRightInternalVariant':
      return 'Lift1DownLeftInternalVariantMirrored';
    case 'Lift2UpRightInternalVariant':
      return 'Lift2UpLeftInternalVariantMirrored';
    case 'Lift2DownRightInternalVariant':
      return 'Lift2DownLeftInternalVariantMirrored';
    case 'PipeRightInternalVariant':
      return 'PipeLeftInternalVariantMirrored';
    case 'PipeUpRightInternalVariant':
      return 'PipeUpLeftInternalVariantMirrored';
    case 'Pipe2UpRightInternalVariant':
      return 'Pipe2UpLeftInternalVariantMirrored';
    case 'WireDefaultRightInternalVariant':
      return 'WireDefaultLeftInternalVariantMirrored';
    case 'WireDefault1UpRightInternalVariant':
      return 'WireDefault1UpLeftInternalVariantMirrored';
    case 'WireDefault2UpRightInternalVariant':
      return 'WireDefault2UpLeftInternalVariantMirrored';
    case 'CutterMirroredInternalVariant':
      return 'CutterDefaultInternalVariantMirrored';
    case 'StackerMirroredInternalVariant':
      return 'StackerDefaultInternalVariantMirrored';
    case 'FluidBridgeSenderInternalVariant':
      return 'FluidPortSenderInternalVariant';
    case 'FluidBridgeReceiverInternalVariant':
      return 'FluidPortReceiverInternalVariant';

    default:
      return type;
  }
};
const getMirroredBlueprintBuildingType = (
  type: BlueprintBuildingIdentifier,
) => {
  switch (type) {
    case 'BeltDefaultLeftInternalVariantMirrored':
      return 'BeltDefaultLeftInternalVariant';
    case 'Splitter1To2LInternalVariantMirrored':
      return 'Splitter1To2LInternalVariant';
    case 'Merger2To1LInternalVariantMirrored':
      return 'Merger2To1LInternalVariant';
    case 'Lift1UpLeftInternalVariantMirrored':
      return 'Lift1UpLeftInternalVariant';
    case 'Lift1DownLeftInternalVariantMirrored':
      return 'Lift1DownLeftInternalVariant';
    case 'Lift2UpLeftInternalVariantMirrored':
      return 'Lift2UpLeftInternalVariant';
    case 'Lift2DownLeftInternalVariantMirrored':
      return 'Lift2DownLeftInternalVariant';
    case 'PipeLeftInternalVariantMirrored':
      return 'PipeLeftInternalVariant';
    case 'PipeUpLeftInternalVariantMirrored':
      return 'PipeUpLeftInternalVariant';
    case 'Pipe2UpLeftInternalVariantMirrored':
      return 'Pipe2UpLeftInternalVariant';
    case 'WireDefaultLeftInternalVariantMirrored':
      return 'WireDefaultLeftInternalVariant';
    case 'WireDefault1UpLeftInternalVariantMirrored':
      return 'WireDefault1UpLeftInternalVariant';
    case 'WireDefault2UpLeftInternalVariantMirrored':
      return 'WireDefault2UpLeftInternalVariant';
    case 'LogicGateIfInternalVariantMirrored':
      return 'LogicGateIfInternalVariant';
    case 'VirtualStackerDefaultInternalVariantMirrored':
      return 'VirtualStackerDefaultInternalVariant';
    case 'VirtualUnstackerDefaultInternalVariantMirrored':
      return 'VirtualUnstackerDefaultInternalVariant';
    case 'VirtualPainterDefaultInternalVariantMirrored':
      return 'VirtualPainterDefaultInternalVariant';
    case 'VirtualCrystalGeneratorDefaultInternalVariantMirrored':
      return 'VirtualCrystalGeneratorDefaultInternalVariant';
    case 'VirtualHalvesSwapperDefaultInternalVariantMirrored':
      return 'VirtualHalvesSwapperDefaultInternalVariant';
    case 'VirtualAnalyzerDefaultInternalVariantMirrored':
      return 'VirtualAnalyzerDefaultInternalVariant';
    case 'PipeGateDefaultInternalVariantMirrored':
      return 'PipeGateDefaultInternalVariant';
    case 'BeltFilterDefaultInternalVariantMirrored':
      return 'BeltFilterDefaultInternalVariant';
    case 'BeltReaderDefaultInternalVariantMirrored':
      return 'BeltReaderDefaultInternalVariant';
    case 'CutterDefaultInternalVariantMirrored':
      return 'CutterDefaultInternalVariant';
    case 'StackerDefaultInternalVariantMirrored':
      return 'StackerDefaultInternalVariant';
    case 'PainterDefaultInternalVariantMirrored':
      return 'PainterDefaultInternalVariant';
    case 'MixerDefaultInternalVariantMirrored':
      return 'MixerDefaultInternalVariant';
    case 'FluidStorageDefaultInternalVariantMirrored':
      return 'FluidStorageDefaultInternalVariant';
    case 'CrystalGeneratorDefaultInternalVariantMirrored':
      return 'CrystalGeneratorDefaultInternalVariant';
    case 'LogicGateCompareInternalVariantMirrored':
      return 'LogicGateCompareInternalVariant';

    default:
      return type;
  }
};
