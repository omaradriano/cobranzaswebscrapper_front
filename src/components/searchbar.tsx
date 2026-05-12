import React from "react";
import styled from "styled-components";
import Icon from "./icon";
import { borderTheme__css } from "../styles/CssComponents";

const SearchBar: React.FC = () => {
  return (
    <SearchBarContainer>
      <SearchInput type="text" placeholder="Ej. GM01020304" />
      <SearchButton>
        <Icon iconName="Search" isButton={true}></Icon>
      </SearchButton>
    </SearchBarContainer>
  );
};

const SearchBarContainer = styled.div`
  /* background-color: red; */
  width: 100%;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  border: 1px solid #0000003e;
  /* ${borderTheme__css} */
`;

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  border-radius: 8px;
  height: 40px;
  background-color: transparent;
  border: none;
  transition: 0.2s linear;
  opacity: 0.6;
`;

export default SearchBar;
