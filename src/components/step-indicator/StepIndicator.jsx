import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import FontIcon from '../font-icon';
import './style.scss';

export default function StepIndicator({
  steps,
  className,
  onClick,
  activeValue,
}) {
  const stepIndicatorClasses = classNames('step-indicator', className);

  let reachedActiveStep = false;

  return (
    <div className={stepIndicatorClasses}>
      {_.map(steps, (step, index) => {
        const { label, value } = step;

        const stepNumber = index + 1;
        const isLastItem = stepNumber === steps.length;
        const isActiveStep = value === activeValue;
        const isCompleted = !isActiveStep && !reachedActiveStep;

        if (isActiveStep) {
          reachedActiveStep = true;
        }

        const containerClasses = classNames('step-indicator__container', {
          'full-width': !isLastItem,
        });

        const stepClasses = classNames('step-indicator__step', {
          'is-active-step': isActiveStep,
          'is-completed-step': isCompleted,
        });

        const stepLineClasses = classNames('step-indicator__step-line', {
          'is-active-step': isActiveStep,
          'is-completed-step': isCompleted,
        });

        const stepTitleClasses = classNames('step-indicator__step-title', {
          'is-active-step': isActiveStep,
          'is-completed-step': isCompleted,
        });

        return (
          <div className={containerClasses} key={value}>
            <div className="step-indicator__col">
              <div className={stepClasses}>
                {!isCompleted && stepNumber}
                {isCompleted && (
                  <FontIcon
                    name="check"
                    className="step-indicator__completed_icon"
                    size="22px"
                  />
                )}
              </div>
              <div className={stepTitleClasses}>
                {!isCompleted && label}
                {isCompleted && (
                  <span onClick={() => onClick(value)}>{label}</span>
                )}
              </div>
            </div>
            {!isLastItem && <div className={stepLineClasses} />}
          </div>
        );
      })}
    </div>
  );
}

StepIndicator.propTypes = {
  steps: PropTypes.array,
  className: PropTypes.string,
  onClick: PropTypes.func,
  activeValue: PropTypes.string,
};
