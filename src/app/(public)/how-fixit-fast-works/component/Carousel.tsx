'use client';

import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
];

export function CarouselSection() {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image
        w={'100%'}
        h={'100%'}
        className="!rounded-3xl"
        src={url}
        alt={`Image ${url}`}
      />
    </Carousel.Slide>
  ));

  return (
    <Carousel maw={548} withControls={false} withIndicators height={400}>
      {slides}
    </Carousel>
  );
};
