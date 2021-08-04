import _ from 'lodash';

export function getDisplayLabel(
  options,
  selectedValues,
  maxSelectedOptionsDisplayed = 1,
  emptyText = 'No data',
) {
  if (_.isEmpty(options) || _.isEmpty(selectedValues)) {
    return emptyText;
  }

  const selectedLabels= _.chain(options)
    .filter(option => _.includes(selectedValues, option.value))
    .map('label')
    .value();

  if (_.size(selectedLabels) <= maxSelectedOptionsDisplayed) {
    return selectedLabels.join(', ');
  }

  const visibleLabels = _.slice(selectedLabels, 0, maxSelectedOptionsDisplayed);
  const suffixLabel = `+ ${(selectedLabels.length - maxSelectedOptionsDisplayed)}`;
  return `${visibleLabels.join(', ')} ${suffixLabel}`;
}
