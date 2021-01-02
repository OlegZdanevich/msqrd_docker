import glam from 'glam';

const CLASS_PREFIX = 'react-images';
export const PhotoHeader = function PhotoHeader(props) {
    const components = props.components,
        getStyles = props.getStyles,
        getCloseLabel = props.getCloseLabel,
        innerProps = props.innerProps,
        isModal = props.isModal,
        modalProps = props.modalProps;


    if (!isModal) return null;
    const action=()=>{
        modalProps.onClose();
        modalProps.allowFullscreen();
    };
    const allowFullscreen = action,
        onClose = modalProps.onClose,
        toggleFullscreen = action;

    const CloseButton = components.CloseButton,
        setMaskButton = components.FullscreenButton;

    const state = {isModal: isModal};

    return glam(
        Div,
        _extends({
            css: getStyles('header', props),
            className: className('header', state)
            , style: {
                background: 'linear-gradient(rgba(0,0,0,0.33), rgba(0,0,0,0))'
            }
        }, innerProps),
        glam('span', null),
        glam(
            'span',
            null,
            allowFullscreen ? glam(
                setMaskButton,
                {
                    getStyles: getStyles,
                    innerProps: {
                        onClick: toggleFullscreen,
                        title: "Set mask"
                    }
                },
                glam(setMaskEnter, {size: 32})
            ) : null,
            glam(
                CloseButton,
                {
                    getStyles: getStyles,
                    innerProps: {
                        onClick: onClose,
                        title: getCloseLabel(state)
                    }
                },
                glam(Close, {size: 32})
            )
        )
    );
};

const setMaskEnter = function setMaskEnter(_ref5) {
    const _ref5$size = _ref5.size,
        size = _ref5$size === undefined ? 32 : _ref5$size,
        props = objectWithoutProperties(_ref5, ['size']);
    return glam(
        Svg,
        _extends({ size: size }, props),
        glam('path', { d: 'M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z' })
    );
};

const objectWithoutProperties = function (obj, keys) {
    const target = {};

    for (let i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }

    return target;
};

const Div = function Div(props) {
    return glam(Base, _extends({ tag: 'div' }, props));
};

const Base = function Base(_ref) {
    const css = _ref.css,
        innerRef = _ref.innerRef,
        Tag = _ref.tag,
        props = objectWithoutProperties(_ref, ['css', 'innerRef', 'tag']);
    return glam(Tag, _extends({
        ref: innerRef,
        css: _extends({
            boxSizing: 'border-box'
        }, css)
    }, props));
};

const _extends = Object.assign || function (target) {
    for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];

        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
};

function className(name, state) {
    const arr = Array.isArray(name) ? name : [name];

    // loop through state object, remove falsey values and combine with name
    if (state && typeof name === 'string') {
        for (const _key in state) {
            if (state.hasOwnProperty(_key) && state[_key]) {
                arr.push(name + '--' + _key);
            }
        }
    }

    // prefix everything and return a string
    return arr.map(function (cn) {
        return CLASS_PREFIX + '__' + cn;
    }).join(' ');
}

const Close = function Close(_ref4) {
    const _ref4$size = _ref4.size,
        size = _ref4$size === undefined ? 32 : _ref4$size,
        props = objectWithoutProperties(_ref4, ['size']);
    return glam(
        Svg,
        _extends({ size: size }, props),
        glam('path', { d: 'M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z' })
    );
};

const Svg = function Svg(_ref) {
    const size = _ref.size,
        props = objectWithoutProperties(_ref, ['size']);
    return glam('svg', _extends({
        role: 'presentation',
        viewBox: '0 0 24 24',
        css: {
            display: 'inline-block',
            fill: 'currentColor',
            height: size,
            stroke: 'currentColor',
            strokeWidth: 0,
            width: size
        }
    }, props));
};