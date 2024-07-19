import React from 'react';
import { useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';
import userManagementMenuIconWhite from '../../assets/userManagementMenuIconWhite.png';

interface GoToLoginPageButtonProps {
  className?: string;
}

const GoToLoginPageButton: React.FC<GoToLoginPageButtonProps> = ({className}) => {
  const navigate = useNavigate();

  return (
    <button
      className={className || 'button-st1'}
      onClick={() => {
        navigate('/');
      }}
    >
      <img
        src={userManagementMenuIconWhite}
      />
      <div>
        <FormattedMessage id="LOGIN" />
      </div>
    </button>
  );
};

export default GoToLoginPageButton;