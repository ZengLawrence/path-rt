
interface Props {
  colors: string[];
}

function backgroundStyle(colors: string[]): string {
  if (colors.length === 1) {
    return colors[0];
  } else {
    const colorStops = colors
      .map((color, index) => {
        const percentStart = (index / colors.length) * 100;
        const percentEnd = ((index + 1) / colors.length) * 100;
        return `${color} ${percentStart.toFixed()}%, ${color} ${percentEnd.toFixed()}%`;
      })
      .join(', ');
    return `linear-gradient(to right, ${colorStops})`;
  }
}

function LineColorIcon(props: Props) {
  return (
    <div
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '10px',
        background: backgroundStyle(props.colors),
      }}
    ></div>
  );
}

export default LineColorIcon;