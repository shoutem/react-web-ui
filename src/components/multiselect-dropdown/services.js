import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import slice from 'lodash/slice';
import size from 'lodash/size';

export function getDisplayLabel(
  options,
  selectedValues,
  maxSelectedOptionsDisplayed = 1,
  emptyText = 'No data',
) {
  if (isEmpty(options) || isEmpty(selectedValues)) {
    return emptyText;
  }

  const filteredlabels = filter(options, option =>
    includes(selectedValues, option.value),
  );

  const selectedLabels = map(filteredlabels, 'label');

  if (size(selectedLabels) <= maxSelectedOptionsDisplayed) {
    return selectedLabels.join(', ');
  }

  const visibleLabels = slice(selectedLabels, 0, maxSelectedOptionsDisplayed);
  const suffixLabel = `+ ${selectedLabels.length -
    maxSelectedOptionsDisplayed}`;
  return `${visibleLabels.join(', ')} ${suffixLabel}`;
}
