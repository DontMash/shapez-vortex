import type { BlueprintBuildingIdentifier, BlueprintBuildingModel } from '$lib/blueprint.types';

import ErrorModel from '$lib/components/models/Error.svelte';
import BeltDefaultForwardInternalVariant_Layer0 from '$lib/components/models/buildings/BeltDefaultForwardInternalVariant_Layer0.svelte';
import BeltDefaultForwardInternalVariant_Layer1 from '$lib/components/models/buildings/BeltDefaultForwardInternalVariant_Layer1.svelte';
import BeltDefaultForwardInternalVariant_Layer2 from '$lib/components/models/buildings/BeltDefaultForwardInternalVariant_Layer2.svelte';
import BeltDefaultLeftInternalVariant_Layer0 from '$lib/components/models/buildings/BeltDefaultLeftInternalVariant_Layer0.svelte';
import BeltDefaultLeftInternalVariant_Layer1 from '$lib/components/models/buildings/BeltDefaultLeftInternalVariant_Layer1.svelte';
import BeltDefaultLeftInternalVariant_Layer2 from '$lib/components/models/buildings/BeltDefaultLeftInternalVariant_Layer2.svelte';
import Splitter1To2LInternalVariant_Layer0 from '$lib/components/models/buildings/Splitter1To2LInternalVariant_Layer0.svelte';
import Splitter1To2LInternalVariant_Layer1 from '$lib/components/models/buildings/Splitter1To2LInternalVariant_Layer1.svelte';
import Splitter1To2LInternalVariant_Layer2 from '$lib/components/models/buildings/Splitter1To2LInternalVariant_Layer2.svelte';
import BeltPortSenderInternalVariant from '$lib/components/models/buildings/BeltPortSenderInternalVariant.svelte';
import BeltPortReceiverInternalVariant from '$lib/components/models/buildings/BeltPortReceiverInternalVariant.svelte';
import SplitterTShapeInternalVariant_Layer0 from '$lib/components/models/buildings/SplitterTShapeInternalVariant_Layer0.svelte';
import SplitterTShapeInternalVariant_Layer1 from '$lib/components/models/buildings/SplitterTShapeInternalVariant_Layer1.svelte';
import SplitterTShapeInternalVariant_Layer2 from '$lib/components/models/buildings/SplitterTShapeInternalVariant_Layer2.svelte';
import Splitter1To3InternalVariant_Layer0 from '$lib/components/models/buildings/Splitter1To3InternalVariant_Layer0.svelte';
import Splitter1To3InternalVariant_Layer1 from '$lib/components/models/buildings/Splitter1To3InternalVariant_Layer1.svelte';
import Splitter1To3InternalVariant_Layer2 from '$lib/components/models/buildings/Splitter1To3InternalVariant_Layer2.svelte';
import Merger2To1LInternalVariant_Layer0 from '$lib/components/models/buildings/Merger2To1LInternalVariant_Layer0.svelte';
import Merger2To1LInternalVariant_Layer1 from '$lib/components/models/buildings/Merger2To1LInternalVariant_Layer1.svelte';
import Merger2To1LInternalVariant_Layer2 from '$lib/components/models/buildings/Merger2To1LInternalVariant_Layer2.svelte';
import MergerTShapeInternalVariant_Layer0 from '$lib/components/models/buildings/MergerTShapeInternalVariant_Layer0.svelte';
import MergerTShapeInternalVariant_Layer1 from '$lib/components/models/buildings/MergerTShapeInternalVariant_Layer1.svelte';
import MergerTShapeInternalVariant_Layer2 from '$lib/components/models/buildings/MergerTShapeInternalVariant_Layer2.svelte';
import Merger3To1InternalVariant_Layer0 from '$lib/components/models/buildings/Merger3To1InternalVariant_Layer0.svelte';
import Merger3To1InternalVariant_Layer1 from '$lib/components/models/buildings/Merger3To1InternalVariant_Layer1.svelte';
import Merger3To1InternalVariant_Layer2 from '$lib/components/models/buildings/Merger3To1InternalVariant_Layer2.svelte';
import Lift1UpForwardInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1UpForwardInternalVariant_Layer0.svelte';
import Lift1UpForwardInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1UpForwardInternalVariant_Layer1.svelte';
import Lift1UpLeftInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1UpLeftInternalVariant_Layer0.svelte';
import Lift1UpLeftInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1UpLeftInternalVariant_Layer1.svelte';
import Lift1UpBackwardInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1UpBackwardInternalVariant_Layer0.svelte';
import Lift1UpBackwardInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1UpBackwardInternalVariant_Layer1.svelte';
import Lift1DownForwardInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1DownForwardInternalVariant_Layer0.svelte';
import Lift1DownForwardInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1DownForwardInternalVariant_Layer1.svelte';
import Lift1DownLeftInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1DownLeftInternalVariant_Layer0.svelte';
import Lift1DownLeftInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1DownLeftInternalVariant_Layer1.svelte';
import Lift1DownBackwardInternalVariant_Layer0 from '$lib/components/models/buildings/Lift1DownBackwardInternalVariant_Layer0.svelte';
import Lift1DownBackwardInternalVariant_Layer1 from '$lib/components/models/buildings/Lift1DownBackwardInternalVariant_Layer1.svelte';
import Lift2UpForwardInternalVariant from '$lib/components/models/buildings/Lift2UpForwardInternalVariant.svelte';
import Lift2UpLeftInternalVariant from '$lib/components/models/buildings/Lift2UpLeftInternalVariant.svelte';
import Lift2UpBackwardInternalVariant from '$lib/components/models/buildings/Lift2UpBackwardInternalVariant.svelte';
import Lift2DownForwardInternalVariant from '$lib/components/models/buildings/Lift2DownForwardInternalVariant.svelte';
import Lift2DownLeftInternalVariant from '$lib/components/models/buildings/Lift2DownLeftInternalVariant.svelte';
import Lift2DownBackwardInternalVariant from '$lib/components/models/buildings/Lift2DownBackwardInternalVariant.svelte';
import PipeForwardInternalVariant_Layer0 from '$lib/components/models/buildings/PipeForwardInternalVariant_Layer0.svelte';
import PipeForwardInternalVariant_Layer1 from '$lib/components/models/buildings/PipeForwardInternalVariant_Layer1.svelte';
import PipeForwardInternalVariant_Layer2 from '$lib/components/models/buildings/PipeForwardInternalVariant_Layer2.svelte';
import PipeLeftInternalVariant_Layer0 from '$lib/components/models/buildings/PipeLeftInternalVariant_Layer0.svelte';
import PipeLeftInternalVariant_Layer1 from '$lib/components/models/buildings/PipeLeftInternalVariant_Layer1.svelte';
import PipeLeftInternalVariant_Layer2 from '$lib/components/models/buildings/PipeLeftInternalVariant_Layer2.svelte';
import PipeCrossInternalVariant_Layer0 from '$lib/components/models/buildings/PipeCrossInternalVariant_Layer0.svelte';
import PipeCrossInternalVariant_Layer1 from '$lib/components/models/buildings/PipeCrossInternalVariant_Layer1.svelte';
import PipeCrossInternalVariant_Layer2 from '$lib/components/models/buildings/PipeCrossInternalVariant_Layer2.svelte';
import PipeJunctionInternalVariant_Layer0 from '$lib/components/models/buildings/PipeJunctionInternalVariant_Layer0.svelte';
import PipeJunctionInternalVariant_Layer1 from '$lib/components/models/buildings/PipeJunctionInternalVariant_Layer1.svelte';
import PipeJunctionInternalVariant_Layer2 from '$lib/components/models/buildings/PipeJunctionInternalVariant_Layer2.svelte';
import PipeUpForwardInternalVariant_Layer0 from '$lib/components/models/buildings/PipeUpForwardInternalVariant_Layer0.svelte';
import PipeUpForwardInternalVariant_Layer1 from '$lib/components/models/buildings/PipeUpForwardInternalVariant_Layer1.svelte';
import PipeUpLeftInternalVariant_Layer0 from '$lib/components/models/buildings/PipeUpLeftInternalVariant_Layer0.svelte';
import PipeUpLeftInternalVariant_Layer1 from '$lib/components/models/buildings/PipeUpLeftInternalVariant_Layer1.svelte';
import PipeUpBackwardInternalVariant_Layer0 from '$lib/components/models/buildings/PipeUpBackwardInternalVariant_Layer0.svelte';
import PipeUpBackwardInternalVariant_Layer1 from '$lib/components/models/buildings/PipeUpBackwardInternalVariant_Layer1.svelte';
import Pipe2UpForwardInternalVariant from '$lib/components/models/buildings/Pipe2UpForwardInternalVariant.svelte';
import Pipe2UpLeftInternalVariant from '$lib/components/models/buildings/Pipe2UpLeftInternalVariant.svelte';
import Pipe2UpBackwardInternalVariant from '$lib/components/models/buildings/Pipe2UpBackwardInternalVariant.svelte';
import FluidPortSenderInternalVariant from '$lib/components/models/buildings/FluidPortSenderInternalVariant.svelte';
import FluidPortReceiverInternalVariant from '$lib/components/models/buildings/FluidPortReceiverInternalVariant.svelte';
import WireDefaultForwardInternalVariant from '$lib/components/models/buildings/WireDefaultForwardInternalVariant.svelte';
import WireDefaultLeftInternalVariant from '$lib/components/models/buildings/WireDefaultLeftInternalVariant.svelte';
import WireDefault1UpForwardInternalVariant from '$lib/components/models/buildings/WireDefault1UpForwardInternalVariant.svelte';
import WireDefault1UpBackwardInternalVariant from '$lib/components/models/buildings/WireDefault1UpBackwardInternalVariant.svelte';
import WireDefault1UpLeftInternalVariant from '$lib/components/models/buildings/WireDefault1UpLeftInternalVariant.svelte';
import WireDefault2UpForwardInternalVariant from '$lib/components/models/buildings/WireDefault2UpForwardInternalVariant.svelte';
import WireDefault2UpBackwardInternalVariant from '$lib/components/models/buildings/WireDefault2UpBackwardInternalVariant.svelte';
import WireDefault2UpLeftInternalVariant from '$lib/components/models/buildings/WireDefault2UpLeftInternalVariant.svelte';
import WireDefaultJunctionInternalVariant from '$lib/components/models/buildings/WireDefaultJunctionInternalVariant.svelte';
import WireDefaultCrossInternalVariant from '$lib/components/models/buildings/WireDefaultCrossInternalVariant.svelte';
import WireDefaultBridgeInternalVariant from '$lib/components/models/buildings/WireDefaultBridgeInternalVariant.svelte';
import WireTransmitterSenderInternalVariant from '$lib/components/models/buildings/WireTransmitterSenderInternalVariant.svelte';
import WireTransmitterReceiverInternalVariant from '$lib/components/models/buildings/WireTransmitterReceiverInternalVariant.svelte';
import WireGlobalTransmitterSenderInternalVariant from '$lib/components/models/buildings/WireGlobalTransmitterSenderInternalVariant.svelte';
import WireGlobalTransmitterReceiverInternalVariant from '$lib/components/models/buildings/WireGlobalTransmitterReceiverInternalVariant.svelte';
import LogicGateAndInternalVariant from '$lib/components/models/buildings/LogicGateAndInternalVariant.svelte';
import LogicGateNotInternalVariant from '$lib/components/models/buildings/LogicGateNotInternalVariant.svelte';
import LogicGateOrInternalVariant from '$lib/components/models/buildings/LogicGateOrInternalVariant.svelte';
import LogicGateXOrInternalVariant from '$lib/components/models/buildings/LogicGateXOrInternalVariant.svelte';
import LogicGateCompareInternalVariant from '$lib/components/models/buildings/LogicGateCompareInternalVariant.svelte';
import LogicGateIfInternalVariant from '$lib/components/models/buildings/LogicGateIfInternalVariant.svelte';
import VirtualAnalyzerDefaultInternalVariant from '$lib/components/models/buildings/VirtualAnalyzerDefaultInternalVariant.svelte';
import VirtualRotatorDefaultInternalVariant from '$lib/components/models/buildings/VirtualRotatorDefaultInternalVariant.svelte';
import VirtualHalfCutterDefaultInternalVariant from '$lib/components/models/buildings/VirtualHalfCutterDefaultInternalVariant.svelte';
import VirtualHalvesSwapperDefaultInternalVariant from '$lib/components/models/buildings/VirtualHalvesSwapperDefaultInternalVariant.svelte';
import VirtualStackerDefaultInternalVariant from '$lib/components/models/buildings/VirtualStackerDefaultInternalVariant.svelte';
import VirtualUnstackerDefaultInternalVariant from '$lib/components/models/buildings/VirtualUnstackerDefaultInternalVariant.svelte';
import VirtualPainterDefaultInternalVariant from '$lib/components/models/buildings/VirtualPainterDefaultInternalVariant.svelte';
import VirtualCrystalGeneratorDefaultInternalVariant from '$lib/components/models/buildings/VirtualCrystalGeneratorDefaultInternalVariant.svelte';
import BeltFilterDefaultInternalVariant from '$lib/components/models/buildings/BeltFilterDefaultInternalVariant.svelte';
import BeltReaderDefaultInternalVariant from '$lib/components/models/buildings/BeltReaderDefaultInternalVariant.svelte';
import DisplayDefaultInternalVariant from '$lib/components/models/buildings/DisplayDefaultInternalVariant.svelte';
import ConstantSignalDefaultInternalVariant from '$lib/components/models/buildings/ConstantSignalDefaultInternalVariant.svelte';
import ButtonDefaultInternalVariant from '$lib/components/models/buildings/ButtonDefaultInternalVariant.svelte';
import SandboxItemProducerDefaultInternalVariant from '$lib/components/models/buildings/SandboxItemProducerDefaultInternalVariant.svelte';
import SandboxFluidProducerDefaultInternalVariant from '$lib/components/models/buildings/SandboxFluidProducerDefaultInternalVariant.svelte';
import LabelDefaultInternalVariant from '$lib/components/models/buildings/LabelDefaultInternalVariant.svelte';
import ExtractorDefaultInternalVariant from '$lib/components/models/buildings/ExtractorDefaultInternalVariant.svelte';
import RotatorOneQuadInternalVariant from '$lib/components/models/buildings/RotatorOneQuadInternalVariant.svelte';
import RotatorOneQuadCCWInternalVariant from '$lib/components/models/buildings/RotatorOneQuadCCWInternalVariant.svelte';
import RotatorHalfInternalVariant from '$lib/components/models/buildings/RotatorHalfInternalVariant.svelte';
import CutterDefaultInternalVariant from '$lib/components/models/buildings/CutterDefaultInternalVariant.svelte';
import CutterHalfInternalVariant from '$lib/components/models/buildings/CutterHalfInternalVariant.svelte';
import HalvesSwapperDefaultInternalVariant from '$lib/components/models/buildings/HalvesSwapperDefaultInternalVariant.svelte';
import StackerDefaultInternalVariant from '$lib/components/models/buildings/StackerDefaultInternalVariant.svelte';
import StackerStraightInternalVariant from '$lib/components/models/buildings/StackerStraightInternalVariant.svelte';
import PinPusherDefaultInternalVariant from '$lib/components/models/buildings/PinPusherDefaultInternalVariant.svelte';
import PumpDefaultInternalVariant from '$lib/components/models/buildings/PumpDefaultInternalVariant.svelte';
import PainterDefaultInternalVariant from '$lib/components/models/buildings/PainterDefaultInternalVariant.svelte';
import MixerDefaultInternalVariant from '$lib/components/models/buildings/MixerDefaultInternalVariant.svelte';
import FluidStorageDefaultInternalVariant from '$lib/components/models/buildings/FluidStorageDefaultInternalVariant.svelte';
import CrystalGeneratorDefaultInternalVariant from '$lib/components/models/buildings/CrystalGeneratorDefaultInternalVariant.svelte';

const BUILDINGS: Record<BlueprintBuildingIdentifier, BlueprintBuildingModel> = {
	BeltDefaultForwardInternalVariant: {
		base: BeltDefaultForwardInternalVariant_Layer0,
		layers: [
			BeltDefaultForwardInternalVariant_Layer0,
			BeltDefaultForwardInternalVariant_Layer1,
			BeltDefaultForwardInternalVariant_Layer2
		]
	},
	BeltDefaultLeftInternalVariant: {
		base: BeltDefaultLeftInternalVariant_Layer0,
		layers: [
			BeltDefaultLeftInternalVariant_Layer0,
			BeltDefaultLeftInternalVariant_Layer1,
			BeltDefaultLeftInternalVariant_Layer2
		]
	},
	BeltPortSenderInternalVariant: {
		base: BeltPortSenderInternalVariant
	},
	BeltPortReceiverInternalVariant: {
		base: BeltPortReceiverInternalVariant
	},
	Splitter1To2LInternalVariant: {
		base: Splitter1To2LInternalVariant_Layer0,
		layers: [
			Splitter1To2LInternalVariant_Layer0,
			Splitter1To2LInternalVariant_Layer1,
			Splitter1To2LInternalVariant_Layer2
		]
	},
	SplitterTShapeInternalVariant: {
		base: SplitterTShapeInternalVariant_Layer0,
		layers: [
			SplitterTShapeInternalVariant_Layer0,
			SplitterTShapeInternalVariant_Layer1,
			SplitterTShapeInternalVariant_Layer2
		]
	},
	Splitter1To3InternalVariant: {
		base: Splitter1To3InternalVariant_Layer0,
		layers: [
			Splitter1To3InternalVariant_Layer0,
			Splitter1To3InternalVariant_Layer1,
			Splitter1To3InternalVariant_Layer2
		]
	},
	Merger2To1LInternalVariant: {
		base: Merger2To1LInternalVariant_Layer0,
		layers: [
			Merger2To1LInternalVariant_Layer0,
			Merger2To1LInternalVariant_Layer1,
			Merger2To1LInternalVariant_Layer2
		]
	},
	MergerTShapeInternalVariant: {
		base: MergerTShapeInternalVariant_Layer0,
		layers: [
			MergerTShapeInternalVariant_Layer0,
			MergerTShapeInternalVariant_Layer1,
			MergerTShapeInternalVariant_Layer2
		]
	},
	Merger3To1InternalVariant: {
		base: Merger3To1InternalVariant_Layer0,
		layers: [
			Merger3To1InternalVariant_Layer0,
			Merger3To1InternalVariant_Layer1,
			Merger3To1InternalVariant_Layer2
		]
	},
	Lift1UpForwardInternalVariant: {
		base: Lift1UpForwardInternalVariant_Layer0,
		layers: [
			Lift1UpForwardInternalVariant_Layer0,
			Lift1UpForwardInternalVariant_Layer1,
			Lift1UpForwardInternalVariant_Layer1
		]
	},
	Lift1UpLeftInternalVariant: {
		base: Lift1UpLeftInternalVariant_Layer0,
		layers: [
			Lift1UpLeftInternalVariant_Layer0,
			Lift1UpLeftInternalVariant_Layer1,
			Lift1UpLeftInternalVariant_Layer1
		]
	},
	Lift1UpBackwardInternalVariant: {
		base: Lift1UpBackwardInternalVariant_Layer0,
		layers: [
			Lift1UpBackwardInternalVariant_Layer0,
			Lift1UpBackwardInternalVariant_Layer1,
			Lift1UpBackwardInternalVariant_Layer1
		]
	},
	Lift1DownForwardInternalVariant: {
		base: Lift1DownForwardInternalVariant_Layer0,
		layers: [
			Lift1DownForwardInternalVariant_Layer0,
			Lift1DownForwardInternalVariant_Layer1,
			Lift1DownForwardInternalVariant_Layer1
		]
	},
	Lift1DownLeftInternalVariant: {
		base: Lift1DownLeftInternalVariant_Layer0,
		layers: [
			Lift1DownLeftInternalVariant_Layer0,
			Lift1DownLeftInternalVariant_Layer1,
			Lift1DownLeftInternalVariant_Layer1
		]
	},
	Lift1DownBackwardInternalVariant: {
		base: Lift1DownBackwardInternalVariant_Layer0,
		layers: [
			Lift1DownBackwardInternalVariant_Layer0,
			Lift1DownBackwardInternalVariant_Layer1,
			Lift1DownBackwardInternalVariant_Layer1
		]
	},
	Lift2UpForwardInternalVariant: {
		base: Lift2UpForwardInternalVariant
	},
	Lift2UpLeftInternalVariant: {
		base: Lift2UpLeftInternalVariant
	},
	Lift2UpBackwardInternalVariant: {
		base: Lift2UpBackwardInternalVariant
	},
	Lift2DownForwardInternalVariant: {
		base: Lift2DownForwardInternalVariant
	},
	Lift2DownLeftInternalVariant: {
		base: Lift2DownLeftInternalVariant
	},
	Lift2DownBackwardInternalVariant: {
		base: Lift2DownBackwardInternalVariant
	},
	PipeForwardInternalVariant: {
		base: PipeForwardInternalVariant_Layer0,
		layers: [
			PipeForwardInternalVariant_Layer0,
			PipeForwardInternalVariant_Layer1,
			PipeForwardInternalVariant_Layer2
		]
	},
	PipeLeftInternalVariant: {
		base: PipeLeftInternalVariant_Layer0,
		layers: [
			PipeLeftInternalVariant_Layer0,
			PipeLeftInternalVariant_Layer1,
			PipeLeftInternalVariant_Layer2
		]
	},
	PipeCrossInternalVariant: {
		base: PipeCrossInternalVariant_Layer0,
		layers: [
			PipeCrossInternalVariant_Layer0,
			PipeCrossInternalVariant_Layer1,
			PipeCrossInternalVariant_Layer2
		]
	},
	PipeJunctionInternalVariant: {
		base: PipeJunctionInternalVariant_Layer0,
		layers: [
			PipeJunctionInternalVariant_Layer0,
			PipeJunctionInternalVariant_Layer1,
			PipeJunctionInternalVariant_Layer2
		]
	},
	PipeUpForwardInternalVariant: {
		base: PipeUpForwardInternalVariant_Layer0,
		layers: [
			PipeUpForwardInternalVariant_Layer0,
			PipeUpForwardInternalVariant_Layer1,
			PipeUpForwardInternalVariant_Layer1
		]
	},
	PipeUpLeftInternalVariant: {
		base: PipeUpLeftInternalVariant_Layer0,
		layers: [
			PipeUpLeftInternalVariant_Layer0,
			PipeUpLeftInternalVariant_Layer1,
			PipeUpLeftInternalVariant_Layer1
		]
	},
	PipeUpBackwardInternalVariant: {
		base: PipeUpBackwardInternalVariant_Layer0,
		layers: [
			PipeUpBackwardInternalVariant_Layer0,
			PipeUpBackwardInternalVariant_Layer1,
			PipeUpBackwardInternalVariant_Layer1
		]
	},
	Pipe2UpForwardInternalVariant: {
		base: Pipe2UpForwardInternalVariant
	},
	Pipe2UpLeftInternalVariant: {
		base: Pipe2UpLeftInternalVariant
	},
	Pipe2UpBackwardInternalVariant: {
		base: Pipe2UpBackwardInternalVariant
	},
	FluidPortSenderInternalVariant: {
		base: FluidPortSenderInternalVariant
	},
	FluidPortReceiverInternalVariant: {
		base: FluidPortReceiverInternalVariant
	},
	WireDefaultForwardInternalVariant: {
		base: WireDefaultForwardInternalVariant
	},
	WireDefaultLeftInternalVariant: {
		base: WireDefaultLeftInternalVariant
	},
	WireDefaultJunctionInternalVariant: {
		base: WireDefaultJunctionInternalVariant
	},
	WireDefaultCrossInternalVariant: {
		base: WireDefaultCrossInternalVariant
	},
	WireDefaultBridgeInternalVariant: {
		base: WireDefaultBridgeInternalVariant
	},
	WireDefault1UpForwardInternalVariant: {
		base: WireDefault1UpForwardInternalVariant
	},
	WireDefault1UpLeftInternalVariant: {
		base: WireDefault1UpLeftInternalVariant
	},
	WireDefault1UpBackwardInternalVariant: {
		base: WireDefault1UpBackwardInternalVariant
	},
	WireDefault2UpForwardInternalVariant: {
		base: WireDefault2UpForwardInternalVariant
	},
	WireDefault2UpLeftInternalVariant: {
		base: WireDefault2UpLeftInternalVariant
	},
	WireDefault2UpBackwardInternalVariant: {
		base: WireDefault2UpBackwardInternalVariant
	},
	WireTransmitterSenderInternalVariant: {
		base: WireTransmitterSenderInternalVariant
	},
	WireTransmitterReceiverInternalVariant: {
		base: WireTransmitterReceiverInternalVariant
	},
	WireGlobalTransmitterSenderInternalVariant: {
		base: WireGlobalTransmitterSenderInternalVariant
	},
	WireGlobalTransmitterReceiverInternalVariant: {
		base: WireGlobalTransmitterReceiverInternalVariant
	},
	LogicGateAndInternalVariant: {
		base: LogicGateAndInternalVariant
	},
	LogicGateNotInternalVariant: {
		base: LogicGateNotInternalVariant
	},
	LogicGateOrInternalVariant: {
		base: LogicGateOrInternalVariant
	},
	LogicGateXOrInternalVariant: {
		base: LogicGateXOrInternalVariant
	},
	LogicGateCompareInternalVariant: {
		base: LogicGateCompareInternalVariant
	},
	LogicGateIfInternalVariant: {
		base: LogicGateIfInternalVariant
	},
	VirtualAnalyzerDefaultInternalVariant: {
		base: VirtualAnalyzerDefaultInternalVariant
	},
	VirtualRotatorDefaultInternalVariant: {
		base: VirtualRotatorDefaultInternalVariant
	},
	VirtualHalfCutterDefaultInternalVariant: {
		base: VirtualHalfCutterDefaultInternalVariant
	},
	VirtualHalvesSwapperDefaultInternalVariant: {
		base: VirtualHalvesSwapperDefaultInternalVariant
	},
	VirtualStackerDefaultInternalVariant: {
		base: VirtualStackerDefaultInternalVariant
	},
	VirtualUnstackerDefaultInternalVariant: {
		base: VirtualUnstackerDefaultInternalVariant
	},
	VirtualPainterDefaultInternalVariant: {
		base: VirtualPainterDefaultInternalVariant
	},
	VirtualCrystalGeneratorDefaultInternalVariant: {
		base: VirtualCrystalGeneratorDefaultInternalVariant
	},
	BeltFilterDefaultInternalVariant: {
		base: BeltFilterDefaultInternalVariant
	},
	BeltReaderDefaultInternalVariant: {
		base: BeltReaderDefaultInternalVariant
	},
	ButtonDefaultInternalVariant: {
		base: ButtonDefaultInternalVariant
	},
	ConstantSignalDefaultInternalVariant: {
		base: ConstantSignalDefaultInternalVariant
	},
	DisplayDefaultInternalVariant: {
		base: DisplayDefaultInternalVariant
	},
	SandboxItemProducerDefaultInternalVariant: {
		base: SandboxItemProducerDefaultInternalVariant
	},
	SandboxFluidProducerDefaultInternalVariant: {
		base: SandboxFluidProducerDefaultInternalVariant
	},
	LabelDefaultInternalVariant: {
		base: LabelDefaultInternalVariant
	},
	ExtractorDefaultInternalVariant: {
		base: ExtractorDefaultInternalVariant
	},
	RotatorOneQuadInternalVariant: {
		base: RotatorOneQuadInternalVariant
	},
	RotatorOneQuadCCWInternalVariant: {
		base: RotatorOneQuadCCWInternalVariant
	},
	RotatorHalfInternalVariant: {
		base: RotatorHalfInternalVariant
	},
	CutterHalfInternalVariant: {
		base: CutterHalfInternalVariant
	},
	CutterDefaultInternalVariant: {
		base: CutterDefaultInternalVariant
	},
	HalvesSwapperDefaultInternalVariant: {
		base: HalvesSwapperDefaultInternalVariant
	},
	StackerDefaultInternalVariant: {
		base: StackerDefaultInternalVariant
	},
	StackerStraightInternalVariant: {
		base: StackerStraightInternalVariant
	},
	PinPusherDefaultInternalVariant: {
		base: PinPusherDefaultInternalVariant
	},
	PumpDefaultInternalVariant: {
		base: PumpDefaultInternalVariant
	},
	PainterDefaultInternalVariant: {
		base: PainterDefaultInternalVariant
	},
	MixerDefaultInternalVariant: {
		base: MixerDefaultInternalVariant
	},
	CrystalGeneratorDefaultInternalVariant: {
		base: CrystalGeneratorDefaultInternalVariant
	},
	FluidStorageDefaultInternalVariant: {
		base: FluidStorageDefaultInternalVariant
	}
};

export const getBlueprintBuildingModel = (type: BlueprintBuildingIdentifier) => {
	const model = BUILDINGS[getBlueprintBuildingType(type)];
	if (!model) {
		console.error(`unknown building ${type}`);
		return {
			base: ErrorModel
		} as BlueprintBuildingModel;
	}
	return model;
};
const getBlueprintBuildingType = (type: BlueprintBuildingIdentifier) => {
	const compatible = getCompatibleBlueprintBuildingType(type);
	const mirrored = getMirroredBlueprintBuildingType(compatible);
	return mirrored;
};
export const COMPATIBLE_MIRRORED_BUILDING_TYPES = [
	'BeltDefaultRightInternalVariant',
	'Splitter1To2RInternalVariant',
	'Merger2To1RInternalVariant',
	'Lift1UpRightInternalVariant',
	'Lift1DownRightInternalVariant',
	'Lift2UpRightInternalVariant',
	'Lift2DownRightInternalVariant',
	'PipeRightInternalVariant',
	'PipeUpRightInternalVariant',
	'Pipe2UpRightInternalVariant',
	'WireDefaultRightInternalVariant',
	'WireDefault1UpRightInternalVariant',
	'WireDefault2UpRightInternalVariant',
	'CutterMirroredInternalVariant'
];
const getCompatibleBlueprintBuildingType = (type: BlueprintBuildingIdentifier) => {
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

		default:
			return type;
	}
};
const getMirroredBlueprintBuildingType = (type: BlueprintBuildingIdentifier) => {
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

		default:
			return type;
	}
};
