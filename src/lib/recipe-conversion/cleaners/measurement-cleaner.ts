
import { logInfo } from '@/utils/logger';

/**
 * Fix common OCR errors with measurements and convert to standard format
 */
export const fixMeasurements = (text: string): string => {
  if (!text) return '';
  
  // Create a mapping for unit standardization with both metric and imperial units
  const unitMap: Record<string, { standard: string, metric?: string, imperial?: string }> = {
    'cup': { standard: 'cup', metric: '240ml', imperial: 'cup' },
    'cups': { standard: 'cups', metric: 'ml', imperial: 'cups' },
    'tablespoon': { standard: 'tbsp', metric: '15ml', imperial: 'tbsp' },
    'tablespoons': { standard: 'tbsp', metric: 'ml', imperial: 'tbsp' },
    'tbsp': { standard: 'tbsp', metric: '15ml', imperial: 'tbsp' },
    'teaspoon': { standard: 'tsp', metric: '5ml', imperial: 'tsp' },
    'teaspoons': { standard: 'tsp', metric: 'ml', imperial: 'tsp' },
    'tsp': { standard: 'tsp', metric: '5ml', imperial: 'tsp' },
    'g': { standard: 'g', metric: 'g', imperial: 'oz' },
    'gram': { standard: 'g', metric: 'g', imperial: 'oz' },
    'grams': { standard: 'g', metric: 'g', imperial: 'oz' },
    'kg': { standard: 'kg', metric: 'kg', imperial: 'lb' },
    'kilogram': { standard: 'kg', metric: 'kg', imperial: 'lb' },
    'kilograms': { standard: 'kg', metric: 'kg', imperial: 'lb' },
    'oz': { standard: 'oz', metric: 'g', imperial: 'oz' },
    'ounce': { standard: 'oz', metric: 'g', imperial: 'oz' },
    'ounces': { standard: 'oz', metric: 'g', imperial: 'oz' },
    'lb': { standard: 'lb', metric: 'kg', imperial: 'lb' },
    'pound': { standard: 'lb', metric: 'kg', imperial: 'lb' },
    'pounds': { standard: 'lb', metric: 'kg', imperial: 'lb' },
    'ml': { standard: 'ml', metric: 'ml', imperial: 'tsp/tbsp/cup' },
    'milliliter': { standard: 'ml', metric: 'ml', imperial: 'tsp/tbsp/cup' },
    'milliliters': { standard: 'ml', metric: 'ml', imperial: 'tsp/tbsp/cup' },
    'l': { standard: 'l', metric: 'l', imperial: 'qt' },
    'liter': { standard: 'l', metric: 'l', imperial: 'qt' },
    'liters': { standard: 'l', metric: 'l', imperial: 'qt' },
  };
  
  let cleaned = text;
  
  // Fix space issues between numbers and units
  cleaned = cleaned.replace(/(\d+)\s+([cmt]?[lbgks])/gi, '$1$2');
  
  // Fix degree symbol OCR errors
  cleaned = cleaned.replace(/(\d+)\s*[oO°]\s*([CF])/gi, '$1°$2');
  
  // Add dual measurements (both metric and imperial) for ingredients
  const measurementRegex = /(\d+[\s\/]*\d*)\s*([a-zA-Z]+)\s+/g;
  let match;
  const matches = [];
  
  // First pass: collect all measurements
  while ((match = measurementRegex.exec(cleaned)) !== null) {
    const amount = match[1].trim();
    const unit = match[2].toLowerCase().trim();
    
    if (unitMap[unit] && unitMap[unit].metric && unitMap[unit].metric !== unit) {
      matches.push({
        original: match[0],
        start: match.index,
        end: match.index + match[0].length,
        amount,
        unit
      });
    }
  }
  
  // Second pass: replace with dual measurements (starting from the end to maintain indices)
  for (let i = matches.length - 1; i >= 0; i--) {
    const { original, start, end, amount, unit } = matches[i];
    
    if (unitMap[unit] && unitMap[unit].metric) {
      let metricAmount = amount;
      const metricUnit = unitMap[unit].metric;
      
      // Simple conversion factors (not exact but good enough for this purpose)
      if (unit === 'cup' || unit === 'cups') {
        metricAmount = parseFloat(amount.replace(/\s+/g, '').replace(/(\d+)\/(\d+)/g, (_, p1, p2) => String(parseInt(p1) / parseInt(p2)))) * 240 + '';
      } else if (unit === 'tbsp' || unit === 'tablespoon' || unit === 'tablespoons') {
        metricAmount = parseFloat(amount.replace(/\s+/g, '').replace(/(\d+)\/(\d+)/g, (_, p1, p2) => String(parseInt(p1) / parseInt(p2)))) * 15 + '';
      } else if (unit === 'tsp' || unit === 'teaspoon' || unit === 'teaspoons') {
        metricAmount = parseFloat(amount.replace(/\s+/g, '').replace(/(\d+)\/(\d+)/g, (_, p1, p2) => String(parseInt(p1) / parseInt(p2)))) * 5 + '';
      } else if (unit === 'oz' || unit === 'ounce' || unit === 'ounces') {
        metricAmount = parseFloat(amount.replace(/\s+/g, '').replace(/(\d+)\/(\d+)/g, (_, p1, p2) => String(parseInt(p1) / parseInt(p2)))) * 28 + '';
      } else if (unit === 'lb' || unit === 'pound' || unit === 'pounds') {
        metricAmount = parseFloat(amount.replace(/\s+/g, '').replace(/(\d+)\/(\d+)/g, (_, p1, p2) => String(parseInt(p1) / parseInt(p2)))) * 0.454 + '';
      }
      
      // Round to 1 decimal place for better readability
      if (!isNaN(parseFloat(metricAmount))) {
        metricAmount = Math.round(parseFloat(metricAmount) * 10) / 10 + '';
      }
      
      // Replace the original with dual measurements
      const replacement = `${original}(${metricAmount} ${metricUnit}) `;
      cleaned = cleaned.substring(0, start) + replacement + cleaned.substring(end);
      
      logInfo("Added dual measurement", {
        original: `${amount} ${unit}`,
        added: `${metricAmount} ${metricUnit}`
      });
    }
  }
  
  return cleaned;
};
