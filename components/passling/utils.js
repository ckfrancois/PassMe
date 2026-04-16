const normalizeToRgba = (colorString) => {
    // Removes parentheses and splits by comma
    const values = colorString.replace(/[()]/g, '').split(',');
    const r = Math.round(parseFloat(values[0]) * 255);
    const g = Math.round(parseFloat(values[1]) * 255);
    const b = Math.round(parseFloat(values[2]) * 255);
    const a = values[3].trim();
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };