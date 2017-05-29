/**
* Created by jzobro 20170524
*/
import React from 'react';
import { shallow } from 'enzyme';
import SeatInfo from '../SeatInfo';

const signerAddr = '0xdb2fdaf5b80c6a4c408e51b36ce7bbdd0c0852c4';

describe('components.seat.SeatInfo', () => {
  // describe('stackToString func', () => {});

  // describe('showChipsButton func', () => {});

  describe('ChipButtonContainer', () => {
    describe('if user seat is NOT active or NOT ready', () => {
      const props = {
        pending: true,
        signerAddr,
      };
      it('should return null', () => {
        const el = shallow(<SeatInfo {...props} />);
        expect(el.find('Pot').length).toEqual(0);
      });
    });

    describe('if user seat is active and ready', () => {
      describe('and lastAmount was > 0', () => {
        const props = {
          lastAmount: 0,
          pending: false,
          seatStatus: '',
          signerAddr,
        };
        it('should NOT render <Pot/>', () => {
          const el = shallow(<SeatInfo {...props} />);
          expect(el.find('.pot').length).toEqual(0);
        });
      });

      describe('and lastAmount was > 0', () => {
        const props = {
          lastAmount: 50,
          pending: false,
          seatStatus: '',
          signerAddr,
        };
        it('should render <Pot/>', () => {
          const el = shallow(<SeatInfo {...props} />);
          expect(el.find('.pot').length).toEqual(1);
        });
      });
    });
  });

  describe('AvatarImage and DetailWrapper component', () => {
    // throws error if signerAddr is not defined
    const props = { signerAddr };
    const el = shallow(<SeatInfo {...props} />);
    it('should render <AvatarImage />', () => {
      // styled components do not have names, so we search for the class
      expect(el.find('.avatar-image').length).toEqual(1);
    });
    it('should render <NameBox />', () => {
      expect(el.find('.name-box').length).toEqual(1);
    });
    it('should render <StackBox />', () => {
      expect(el.find('.stack-box').length).toEqual(1);
    });
  });
});
