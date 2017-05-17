
import styled from 'styled-components';

// components
export const SeatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 128px;

  color: white;
  background-color: none;
`;

// cards
export const CardWrapper = styled.div`
  display: flex;
  margin-left: 48px;

  background-color: none;
`;

export const Card = styled.div`
  background-color: green;
  width: 2em;
`;

// info
export const InfoWrapper = styled.div`
  display: flex;

  background-color: #333;
  background-image: linear-gradient(-180deg, #787878 0%, #393939 50%, #1F1F1F 50%, #3C3C3C 100%);
  border-radius: 4px;
`;

export const AvatarImage = styled.img`
  background-color: AliceBlue;
  border-radius: 3px;
  margin: 3px 4px;
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background-color: none;
  margin-left: 2px;
`;

export const Username = styled.div`
  font-size: 0.9em;
  background-color: none;
  color: white;
`;

export const ChipCount = styled.div`
  font-size: 0.9em;
  background-color: none;
  color: white;
`;

// status
export const StatusWrapper = styled.div`
  display: flex;

  background-color: none;
`;

export const Status = styled.div`
  margin-left: 10px;

  color: darkgray;
  background-color: lightgreen;
`;
