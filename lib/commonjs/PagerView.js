"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagerView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _utils = require("./utils");
var _PagerViewNativeComponent = _interopRequireWildcard(require("./specs/PagerViewNativeComponent"));
var _LEGACY_PagerViewNativeComponent = _interopRequireWildcard(require("./specs/LEGACY_PagerViewNativeComponent"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// The Fabric component for PagerView uses a work around present also in ScrollView:
// https://github.com/callstack/react-native-pager-view/blob/master/ios/Fabric/RNCPagerViewComponentView.mm#L362-L368
// That workaround works only if we add these lines in to make sure that the RCTEventEmitter is registered properly
// in the JS callable modules.
// NOTE: This is a workaround as we would like to get rid of these lines below. But for the time being, as the cut date for
// 0.74 approaches, we need to keep these lines.
// As soon as we figure out how to move forward, we will provide guidance and/or submit a PR to fix this.
if (_reactNative.Platform.OS === 'ios') {
  require('react-native/Libraries/Renderer/shims/ReactNative'); // Force side effects to prevent T55744311
}

/**
 * Container that allows to flip left and right between child views. Each
 * child view of the `PagerView` will be treated as a separate page
 * and will be stretched to fill the `PagerView`.
 *
 * It is important all children are `<View>`s and not composite components.
 * You can set style properties like `padding` or `backgroundColor` for each
 * child. It is also important that each child have a `key` prop.
 *
 * Example:
 *
 * ```
 * render: function() {
 *   return (
 *     <PagerView
 *       style={styles.PagerView}
 *       initialPage={0}>
 *       <View style={styles.pageStyle} key="1">
 *         <Text>First page</Text>
 *       </View>
 *       <View style={styles.pageStyle} key="2">
 *         <Text>Second page</Text>
 *       </View>
 *     </PagerView>
 *   );
 * }
 *
 * ...
 *
 * var styles = {
 *   ...
 *   PagerView: {
 *     flex: 1
 *   },
 *   pageStyle: {
 *     alignItems: 'center',
 *     padding: 20,
 *   }
 * }
 * ```
 */

class PagerViewInternal extends _react.default.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "isScrolling", false);
    _defineProperty(this, "pagerView", null);
    _defineProperty(this, "_onPageScroll", e => {
      if (this.props.onPageScroll) {
        this.props.onPageScroll(e);
      }

      // Not implemented on iOS yet
      if (_reactNative.Platform.OS === 'android') {
        if (this.props.keyboardDismissMode === 'on-drag') {
          _reactNative.Keyboard.dismiss();
        }
      }
    });
    _defineProperty(this, "_onPageScrollStateChanged", e => {
      if (this.props.onPageScrollStateChanged) {
        this.props.onPageScrollStateChanged(e);
      }
      this.isScrolling = e.nativeEvent.pageScrollState === 'dragging';
    });
    _defineProperty(this, "_onPageSelected", e => {
      if (this.props.onPageSelected) {
        this.props.onPageSelected(e);
      }
    });
    _defineProperty(this, "_onMoveShouldSetResponderCapture", () => {
      return this.isScrolling;
    });
    /**
     * A helper function to scroll to a specific page in the PagerView.
     * The transition between pages will be animated.
     */
    _defineProperty(this, "setPage", selectedPage => {
      if (this.pagerView) {
        this.nativeCommandsWrapper.setPage(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to scroll to a specific page in the PagerView.
     * The transition between pages will *not* be animated.
     */
    _defineProperty(this, "setPageWithoutAnimation", selectedPage => {
      if (this.pagerView) {
        this.nativeCommandsWrapper.setPageWithoutAnimation(this.pagerView, selectedPage);
      }
    });
    /**
     * A helper function to enable/disable scroll imperatively
     * The recommended way is using the scrollEnabled prop, however, there might be a case where a
     * imperative solution is more useful (e.g. for not blocking an animation)
     */
    _defineProperty(this, "setScrollEnabled", scrollEnabled => {
      if (this.pagerView) {
        this.nativeCommandsWrapper.setScrollEnabledImperatively(this.pagerView, scrollEnabled);
      }
    });
  }
  get nativeCommandsWrapper() {
    return this.props.useLegacy ? _LEGACY_PagerViewNativeComponent.Commands : _PagerViewNativeComponent.Commands;
  }
  get deducedLayoutDirection() {
    if (!this.props.layoutDirection ||
    //@ts-ignore fix it
    this.props.layoutDirection === 'locale') {
      return _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr';
    } else {
      return this.props.layoutDirection;
    }
  }
  render() {
    // old iOS `UIPageViewController`-based implementation
    if (_reactNative.Platform.OS === 'ios' && this.props.useLegacy) {
      return /*#__PURE__*/_react.default.createElement(_LEGACY_PagerViewNativeComponent.default, _extends({}, this.props, {
        ref: ref => {
          this.pagerView = ref;
        },
        style: this.props.style,
        layoutDirection: this.deducedLayoutDirection,
        onPageScroll: this._onPageScroll,
        onPageScrollStateChanged: this._onPageScrollStateChanged,
        onPageSelected: this._onPageSelected,
        onMoveShouldSetResponderCapture: this._onMoveShouldSetResponderCapture,
        children: (0, _utils.LEGACY_childrenWithOverriddenStyle)(this.props.children)
      }));
    }
    const style = [this.props.style, this.props.pageMargin ? {
      marginHorizontal: -this.props.pageMargin / 2
    } : null, {
      flexDirection: this.props.orientation === 'vertical' ? 'column' : 'row'
    }];

    // new iOS `UIScrollView`-based implementation, Android, and other platforms
    return /*#__PURE__*/_react.default.createElement(_PagerViewNativeComponent.default, _extends({}, this.props, {
      ref: ref => {
        this.pagerView = ref;
      },
      style: style,
      layoutDirection: this.deducedLayoutDirection,
      onPageScroll: this._onPageScroll,
      onPageScrollStateChanged: this._onPageScrollStateChanged,
      onPageSelected: this._onPageSelected,
      onMoveShouldSetResponderCapture: this._onMoveShouldSetResponderCapture,
      children: (0, _utils.childrenWithOverriddenStyle)(this.props.children, this.props.pageMargin)
    }));
  }
}

// Temporary solution. It should be removed once all things get fixed

const PagerView = /*#__PURE__*/_react.default.forwardRef((props, ref) => {
  const {
    useNext,
    ...rest
  } = props;
  return /*#__PURE__*/_react.default.createElement(PagerViewInternal, _extends({}, rest, {
    useLegacy: !useNext,
    ref: ref
  }));
});

// React.forwardRef does not type returned component properly, thus breaking Ref<MyComponent> typing.
// One way to overcome this is using separate typing for component "interface",
// but that breaks backward compatibility in this case.
// Approach of merging type is hacky, but produces a good typing for both ref attributes and component itself.
exports.PagerView = PagerView;
//# sourceMappingURL=PagerView.js.map