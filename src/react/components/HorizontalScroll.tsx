import React, { useState } from "react";
import { Text, Box, Flex, TextProps } from "@chakra-ui/react";

const arrowStyles: TextProps = {
  cursor: "pointer",
  pos: "absolute",
  w: "auto",
  mt: "-22px",
  p: "3.5",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
  transition: "0.6s ease",
  borderRadius: "0 3px 3px 0",
  userSelect: "none",
  opacity: 0.6,
  bg: "black",
  _hover: {
    opacity: 1.0,
    bg: "black",
  },
};

const splitArr = (
  elements: (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
) => {
  let _elements = elements;
  let arrayOfArrays: (
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
  )[] = [];

  while (_elements.length > 0) {
    let max = _elements.length;
    let arrayElement = _elements.splice(0, max > 7 ? 7 : max);
    arrayOfArrays.push(arrayElement);
  }
  return arrayOfArrays;
};

export const HorizontalScroll: React.FC = ({ children }) => {
  const childArr = React.Children.toArray(children);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = splitArr(childArr);

  const slidesCount = slides.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  return (
    <Flex w="full" minH={56} p={5} alignItems="center" justifyContent="center">
      <Flex w="full" pos="relative" overflow="hidden">
        <Flex w="full" {...carouselStyle}>
          {slides.map((slide, sid) => (
            <Box key={`slide-${sid}`} boxSize="full" flex="none">
              {React.Children.count(slide) > 2 ? (
                <Flex justify={"space-evenly"}>{slide}</Flex>
              ) : (
                <Flex pl={6}>{slide}</Flex>
              )}
            </Box>
          ))}
        </Flex>
      </Flex>
      <Text {...arrowStyles} left="0" onClick={prevSlide}>
        &#10094;
      </Text>
      <Text {...arrowStyles} right="0" onClick={nextSlide}>
        &#10095;
      </Text>
    </Flex>
  );
};
