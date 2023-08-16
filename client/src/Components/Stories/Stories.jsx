import { Box, Card, styled } from '@mui/material';

const ScrollableContainer = styled('div')({
  width: '82%',
  height: 'fit-content',
  whiteSpace: 'nowrap',
  overflowX: 'scroll',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none', /* Hide the scrollbar for Firefox */
  '&::-webkit-scrollbar': {
    display: 'none', /* Hide the scrollbar for Chrome, Safari, and Edge */
  },
  /* Enable scrolling with the mouse wheel */
  '&:hover': {
    overflowX: 'auto',
  },
});

const ProductCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: 100,
  height: 100,
  display: 'inline-block',
  margin: theme.spacing(0, 0.5),
  boxShadow: theme.shape.shadow,
}));

const Stories = () => {
  const handleScroll = (event) => {
    const container = event.target;
    const scrollAmount = event.deltaY;
    container.scrollLeft += scrollAmount;
  };

  return (
    <Box display={'flex'} ml={'1.5rem'}>
    <ProductCard>
            hello
    </ProductCard>
    <ScrollableContainer onWheel={handleScroll}>
      <div style={{ width: 600 }}> {/* Set a fixed width */}
        {Array.from(Array(10).keys()).map((index) => (
          <ProductCard key={index}>
            hello
          </ProductCard>
        ))}
      </div>
    </ScrollableContainer>
    </Box>
  );
};

export default Stories;
