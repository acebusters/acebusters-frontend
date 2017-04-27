
import React from 'react';
import styled from 'styled-components';

const boxSizing = 'box-sizing: content-box;';

const SlidesWrapper = styled.div`
  ${boxSizing}
  position: relative;
  padding: 30px 50px 10px;
`;

const SlidesOuter = styled.div`
  ${boxSizing}
  overflow: hidden;
`;

const SlidesInner = styled.div`
  ${boxSizing}
  position: relative;
  overflow-y: hidden;
  width: 10000px;
  transition: 0.5s;
`;

const SlideBox = styled.div`
  ${boxSizing}
  float: left;
`;

const slideDirectionStyle = `
  ${boxSizing}
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  transform: translateY(-50%);
  text-align: center;
  cursor: pointer;
`;

const SlideLeft = styled.div`
  ${boxSizing}
  ${slideDirectionStyle}
  left: 10px;
`;

const SlideRight = styled.div`
  ${boxSizing}
  ${slideDirectionStyle}
  right: 10px;
`;

const DotBox = styled.div`
  ${boxSizing}
  margin-top: 30px;
  text-align: center;
`;

const Dot = styled.div`
  ${boxSizing}
  display: inline-block;
  background: ${(props) => props.isOn ? '#666' : '#ccc'};
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-right: 16px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;


class Slides extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };

    this.genGoto = this.genGoto.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  prev() {
    const index = this.state.slideIndex;
    const total = this.props.children.length;

    this.setState({
      slideIndex: ((total + index) - 1) % total,
    });
  }

  next() {
    const index = this.state.slideIndex;
    const total = this.props.children.length;

    this.setState({
      slideIndex: (index + 1) % total,
    });
  }

  genGoto(index) {
    return () => {
      this.setState({
        slideIndex: index,
      });
    };
  }

  render() {
    const {
      children,
      width = 500,
      height = 400,
      SlidesWrapperComponent = SlidesWrapper,
      SlidesOuterComponent = SlidesOuter,
      SlidesInnerComponent = SlidesInner,
      SlideBoxComponent = SlideBox,
      SlideLeftComponent = SlideLeft,
      SlideRightComponent = SlideRight,
      DotBoxComponent = DotBox,
      DotComponent = Dot,
    } = this.props;

    const { slideIndex } = this.state;

    return (
      <SlidesWrapperComponent style={{ width: `${width}px` }}>
        <SlidesOuterComponent style={{ width: `${width}px` }}>
          <SlidesInnerComponent style={{ height: `${height}px`, left: `${-1 * width * slideIndex}px` }}>
            {children.map((slide, index) => (
              <SlideBoxComponent key={index} style={{ width: `${width}px`, height: `${height}px` }}>
                {slide}
              </SlideBoxComponent>
            ))}
          </SlidesInnerComponent>
        </SlidesOuterComponent>
        <SlideLeftComponent onClick={this.prev}>
          <i className="fa fa-angle-left" style={{ fontSize: '30px' }}></i>
        </SlideLeftComponent>
        <SlideRightComponent onClick={this.next}>
          <i className="fa fa-angle-right" style={{ fontSize: '30px' }}></i>
        </SlideRightComponent>
        <DotBoxComponent>
          {children.map((slide, index) => (
            <DotComponent
              key={index}
              onClick={this.genGoto(index)}
              isOn={index === slideIndex}
            />
          ))}
        </DotBoxComponent>
      </SlidesWrapperComponent>
    );
  }
}

Slides.propTypes = {
  children: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  SlidesWrapperComponent: React.PropTypes.instanceOf(React.Component),
  SlideBoxComponent: React.PropTypes.instanceOf(React.Component),
  SlidesOuterComponent: React.PropTypes.instanceOf(React.Component),
  SlidesInnerComponent: React.PropTypes.instanceOf(React.Component),
  SlideLeftComponent: React.PropTypes.instanceOf(React.Component),
  SlideRightComponent: React.PropTypes.instanceOf(React.Component),
  DotBoxComponent: React.PropTypes.instanceOf(React.Component),
  DotComponent: React.PropTypes.instanceOf(React.Component),
};

export default Slides;
