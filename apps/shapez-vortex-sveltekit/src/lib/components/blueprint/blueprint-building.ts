import type { BuildingInternalVariantId } from '@shapez-vortex/game-data';
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
  Lift1DownForwardInternalVariant_Layer1,
  Lift1DownLeftInternalVariant_Layer1,
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
  ControlledSignalReceiverInternalVariantMirrored,
  BeltFilterDefaultInternalVariantMirrored,
  BeltReaderDefaultInternalVariantMirrored,
  ControlledSignalReceiverInternalVariant,
  ControlledSignalTransmitterInternalVariant,
  ControlledSignalTransmitterInternalVariantMirrored,
  CrystalGeneratorDefaultInternalVariantMirrored,
  CutterDefaultInternalVariantMirrored,
  Display2x2InternalVariant,
  Display2x2InternalVariantMirrored,
  Display3x3InternalVariant,
  Display3x3InternalVariantMirrored,
  FluidStorageDefaultInternalVariantMirrored,
  Lift2DownLeftInternalVariantMirrored,
  Lift2UpLeftInternalVariantMirrored,
  LogicGateCompareInternalVariantMirrored,
  LogicGateIfInternalVariantMirrored,
  MixerDefaultInternalVariantMirrored,
  PainterDefaultInternalVariantMirrored,
  PipeGateDefaultInternalVariantMirrored,
  StackerDefaultInternalVariantMirrored,
  VirtualAnalyzerDefaultInternalVariantMirrored,
  VirtualCrystalGeneratorDefaultInternalVariantMirrored,
  VirtualPainterDefaultInternalVariantMirrored,
  VirtualRotatorCCWInternalVariant,
  VirtualStackerTallInternalVariant,
  VirtualUnstackerTallInternalVariant,
  WireDefault1UpLeftInternalVariantMirrored,
  WireDefault2UpLeftInternalVariantMirrored,
  WireDefaultLeftInternalVariantMirrored,
  BeltDefaultLeftInternalVariantMirrored_Layer0,
  BeltPortSenderInternalVariant_Layer0,
  BeltPortSenderInternalVariant_Layer1,
  BeltPortSenderInternalVariant_Layer2,
  BeltPortReceiverInternalVariant_Layer0,
  BeltPortReceiverInternalVariant_Layer1,
  BeltPortReceiverInternalVariant_Layer2,
  FluidPortSenderInternalVariant_Layer0,
  FluidPortSenderInternalVariant_Layer1,
  FluidPortSenderInternalVariant_Layer2,
  FluidPortReceiverInternalVariant_Layer0,
  FluidPortReceiverInternalVariant_Layer1,
  FluidPortReceiverInternalVariant_Layer2,
  Lift1DownLeftInternalVariantMirrored_Layer1,
  Lift1DownLeftInternalVariantMirrored_Layer2,
  Lift1UpLeftInternalVariantMirrored_Layer0,
  Lift1UpLeftInternalVariantMirrored_Layer1,
  Lift1DownLeftInternalVariant_Layer2,
  Lift1DownBackwardInternalVariant_Layer2,
  Lift1DownForwardInternalVariant_Layer2,
  Merger2To1LInternalVariantMirrored_Layer0,
  Merger2To1LInternalVariantMirrored_Layer1,
  Merger2To1LInternalVariantMirrored_Layer2,
  PipeLeftInternalVariantMirrored_Layer0,
  PipeLeftInternalVariantMirrored_Layer1,
  PipeLeftInternalVariantMirrored_Layer2,
  PipeLift_Layer0,
  PipeLift_Layer1,
  PipeLift_Layer2,
  PipeLiftInverter_Layer0,
  PipeLiftInverter_Layer1,
  PipeLiftInverter_Layer2,
  PipeUp_Layer0,
  PipeUp_Layer1,
  PipeUp_Layer2,
  Splitter1To2LInternalVariantMirrored_Layer0,
  Splitter1To2LInternalVariantMirrored_Layer1,
  Splitter1To2LInternalVariantMirrored_Layer2,
  SplitterOverflowLInternalVariant_Layer0,
  SplitterOverflowLInternalVariant_Layer1,
  SplitterOverflowLInternalVariant_Layer2,
  SplitterOverflowLInternalVariantMirrored_Layer0,
  SplitterOverflowLInternalVariantMirrored_Layer1,
  SplitterOverflowLInternalVariantMirrored_Layer2,
  PipeUpLeftInternalVariantMirrored_Layer0,
  PipeUpLeftInternalVariantMirrored_Layer1,
  Pipe2UpLeftInternalVariantMirrored_Layer2,
  BeltDefaultLeftInternalVariantMirrored_Layer1,
  BeltDefaultLeftInternalVariantMirrored_Layer2,
} from '@shapez-vortex/models';
import type { Component } from 'svelte';

type BlueprintBuildingModel = {
  base: Component;
  layers?: [Component, Component, Component];
};
const BUILDINGS: Record<BuildingInternalVariantId, BlueprintBuildingModel> = {
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
    base: BeltPortSenderInternalVariant_Layer0,
    layers: [
      BeltPortSenderInternalVariant_Layer0,
      BeltPortSenderInternalVariant_Layer1,
      BeltPortSenderInternalVariant_Layer2,
    ],
  },
  BeltPortReceiverInternalVariant: {
    base: BeltPortReceiverInternalVariant_Layer0,
    layers: [
      BeltPortReceiverInternalVariant_Layer0,
      BeltPortReceiverInternalVariant_Layer1,
      BeltPortReceiverInternalVariant_Layer2,
    ],
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
    base: Lift1DownForwardInternalVariant_Layer1,
    layers: [
      Lift1DownForwardInternalVariant_Layer1,
      Lift1DownForwardInternalVariant_Layer1,
      Lift1DownForwardInternalVariant_Layer2,
    ],
  },
  Lift1DownLeftInternalVariant: {
    base: Lift1DownLeftInternalVariant_Layer1,
    layers: [
      Lift1DownLeftInternalVariant_Layer1,
      Lift1DownLeftInternalVariant_Layer1,
      Lift1DownLeftInternalVariant_Layer2,
    ],
  },
  Lift1DownBackwardInternalVariant: {
    base: Lift1DownBackwardInternalVariant_Layer1,
    layers: [
      Lift1DownBackwardInternalVariant_Layer1,
      Lift1DownBackwardInternalVariant_Layer1,
      Lift1DownBackwardInternalVariant_Layer2,
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
    base: FluidPortSenderInternalVariant_Layer0,
    layers: [
      FluidPortSenderInternalVariant_Layer0,
      FluidPortSenderInternalVariant_Layer1,
      FluidPortSenderInternalVariant_Layer2,
    ],
  },
  FluidPortReceiverInternalVariant: {
    base: FluidPortReceiverInternalVariant_Layer0,
    layers: [
      FluidPortReceiverInternalVariant_Layer0,
      FluidPortReceiverInternalVariant_Layer1,
      FluidPortReceiverInternalVariant_Layer2,
    ],
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
  BeltDefaultLeftInternalVariantMirrored: {
    base: BeltDefaultLeftInternalVariantMirrored_Layer0,
    layers: [
      BeltDefaultLeftInternalVariantMirrored_Layer0,
      BeltDefaultLeftInternalVariantMirrored_Layer1,
      BeltDefaultLeftInternalVariantMirrored_Layer2,
    ],
  },
  BeltFilterDefaultInternalVariantMirrored: {
    base: BeltFilterDefaultInternalVariantMirrored,
  },
  BeltReaderDefaultInternalVariantMirrored: {
    base: BeltReaderDefaultInternalVariantMirrored,
  },
  CrystalGeneratorDefaultInternalVariantMirrored: {
    base: CrystalGeneratorDefaultInternalVariantMirrored,
  },
  CutterDefaultInternalVariantMirrored: {
    base: CutterDefaultInternalVariantMirrored,
  },
  Display2x2InternalVariant: {
    base: Display2x2InternalVariant,
  },
  Display2x2InternalVariantMirrored: {
    base: Display2x2InternalVariantMirrored,
  },
  Display3x3InternalVariant: {
    base: Display3x3InternalVariant,
  },
  Display3x3InternalVariantMirrored: {
    base: Display3x3InternalVariantMirrored,
  },
  FluidStorageDefaultInternalVariantMirrored: {
    base: FluidStorageDefaultInternalVariantMirrored,
  },
  Lift1DownLeftInternalVariantMirrored: {
    base: Lift1DownLeftInternalVariantMirrored_Layer1,
    layers: [
      Lift1DownLeftInternalVariantMirrored_Layer1,
      Lift1DownLeftInternalVariantMirrored_Layer1,
      Lift1DownLeftInternalVariantMirrored_Layer2,
    ],
  },
  Lift1UpLeftInternalVariantMirrored: {
    base: Lift1UpLeftInternalVariantMirrored_Layer0,
    layers: [
      Lift1UpLeftInternalVariantMirrored_Layer0,
      Lift1UpLeftInternalVariantMirrored_Layer1,
      Lift1UpLeftInternalVariantMirrored_Layer1,
    ],
  },
  Lift2DownLeftInternalVariantMirrored: {
    base: Lift2DownLeftInternalVariantMirrored,
  },
  Lift2UpLeftInternalVariantMirrored: {
    base: Lift2UpLeftInternalVariantMirrored,
  },
  LogicGateCompareInternalVariantMirrored: {
    base: LogicGateCompareInternalVariantMirrored,
  },
  LogicGateIfInternalVariantMirrored: {
    base: LogicGateIfInternalVariantMirrored,
  },
  Merger2To1LInternalVariantMirrored: {
    base: Merger2To1LInternalVariantMirrored_Layer0,
    layers: [
      Merger2To1LInternalVariantMirrored_Layer0,
      Merger2To1LInternalVariantMirrored_Layer1,
      Merger2To1LInternalVariantMirrored_Layer2,
    ],
  },
  MixerDefaultInternalVariantMirrored: {
    base: MixerDefaultInternalVariantMirrored,
  },
  PainterDefaultInternalVariantMirrored: {
    base: PainterDefaultInternalVariantMirrored,
  },
  PipeUpLeftInternalVariantMirrored: {
    base: PipeUpLeftInternalVariantMirrored_Layer0,
    layers: [
      PipeUpLeftInternalVariantMirrored_Layer0,
      PipeUpLeftInternalVariantMirrored_Layer1,
      Pipe2UpLeftInternalVariantMirrored_Layer2,
    ],
  },
  Pipe2UpLeftInternalVariantMirrored: {
    // TODO: Add model
    base: ErrorModel,
  },
  PipeLeftInternalVariantMirrored: {
    base: PipeLeftInternalVariantMirrored_Layer0,
    layers: [
      PipeLeftInternalVariantMirrored_Layer0,
      PipeLeftInternalVariantMirrored_Layer1,
      PipeLeftInternalVariantMirrored_Layer2,
    ],
  },
  PipeLift: {
    base: PipeLift_Layer0,
    layers: [PipeLift_Layer0, PipeLift_Layer1, PipeLift_Layer2],
  },
  PipeLiftInverter: {
    base: PipeLiftInverter_Layer0,
    layers: [
      PipeLiftInverter_Layer0,
      PipeLiftInverter_Layer1,
      PipeLiftInverter_Layer2,
    ],
  },
  PipeUp: {
    base: PipeUp_Layer0,
    layers: [PipeUp_Layer0, PipeUp_Layer1, PipeUp_Layer2],
  },
  PipeGateDefaultInternalVariantMirrored: {
    base: PipeGateDefaultInternalVariantMirrored,
  },
  Splitter1To2LInternalVariantMirrored: {
    base: Splitter1To2LInternalVariantMirrored_Layer0,
    layers: [
      Splitter1To2LInternalVariantMirrored_Layer0,
      Splitter1To2LInternalVariantMirrored_Layer1,
      Splitter1To2LInternalVariantMirrored_Layer2,
    ],
  },
  StackerDefaultInternalVariantMirrored: {
    base: StackerDefaultInternalVariantMirrored,
  },
  VirtualAnalyzerDefaultInternalVariantMirrored: {
    base: VirtualAnalyzerDefaultInternalVariantMirrored,
  },
  VirtualPainterDefaultInternalVariantMirrored: {
    base: VirtualPainterDefaultInternalVariantMirrored,
  },
  VirtualRotatorCCWInternalVariant: {
    base: VirtualRotatorCCWInternalVariant,
  },
  VirtualStackerTallInternalVariant: {
    base: VirtualStackerTallInternalVariant,
  },
  VirtualUnstackerTallInternalVariant: {
    base: VirtualUnstackerTallInternalVariant,
  },
  VirtualCrystalGeneratorDefaultInternalVariantMirrored: {
    base: VirtualCrystalGeneratorDefaultInternalVariantMirrored,
  },
  WireDefaultLeftInternalVariantMirrored: {
    base: WireDefaultLeftInternalVariantMirrored,
  },
  WireDefault1UpLeftInternalVariantMirrored: {
    base: WireDefault1UpLeftInternalVariantMirrored,
  },
  WireDefault2UpLeftInternalVariantMirrored: {
    base: WireDefault2UpLeftInternalVariantMirrored,
  },
  ControlledSignalTransmitterInternalVariant: {
    base: ControlledSignalTransmitterInternalVariant,
  },
  ControlledSignalTransmitterInternalVariantMirrored: {
    base: ControlledSignalTransmitterInternalVariantMirrored,
  },
  SplitterOverflowLInternalVariant: {
    base: SplitterOverflowLInternalVariant_Layer0,
    layers: [
      SplitterOverflowLInternalVariant_Layer0,
      SplitterOverflowLInternalVariant_Layer1,
      SplitterOverflowLInternalVariant_Layer2,
    ],
  },
  SplitterOverflowLInternalVariantMirrored: {
    base: SplitterOverflowLInternalVariantMirrored_Layer0,
    layers: [
      SplitterOverflowLInternalVariantMirrored_Layer0,
      SplitterOverflowLInternalVariantMirrored_Layer1,
      SplitterOverflowLInternalVariantMirrored_Layer2,
    ],
  },
  ControlledSignalReceiverInternalVariant: {
    base: ControlledSignalReceiverInternalVariant,
  },
  ControlledSignalReceiverInternalVariantMirrored: {
    base: ControlledSignalReceiverInternalVariantMirrored,
  },
};

export const getBlueprintBuildingModel = (type: BuildingInternalVariantId) => {
  const model = BUILDINGS[type];
  if (!model) {
    console.error(`unknown building ${type}`);
    return {
      base: ErrorModel,
    } as BlueprintBuildingModel;
  }
  return model;
};
