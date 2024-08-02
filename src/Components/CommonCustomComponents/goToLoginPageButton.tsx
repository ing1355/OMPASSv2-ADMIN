import React from 'react';
import { useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';
import userManagementMenuIconWhite from '../../assets/userManagementMenuIconWhite.png';
import Button from './Button';

interface GoToLoginPageButtonProps {
  className?: string;
}

const GoToLoginPageButton: React.FC<GoToLoginPageButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button
      className={className || 'st3'}
      onClick={() => {
        navigate('/');
      }}
      icon={userManagementMenuIconWhite}
    >
      <FormattedMessage id="LOGIN" />
    </Button>
  );
};

export default GoToLoginPageButton;