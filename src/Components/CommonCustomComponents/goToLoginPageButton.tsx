import React from 'react';
import { useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';
import user_management_white from '../../assets/user_management_white.png';

interface GoToLoginPageButtonProps {
  className: string;
}

const GoToLoginPageButton: React.FC<GoToLoginPageButtonProps> = ({className}) => {
  const navigate = useNavigate();

  return (
    <button
      className={className}
      onClick={() => {
        navigate('/');
      }}
    >
      <img
        src={user_management_white}
        width="32px"
        style={{ marginLeft: '4px', position: 'relative', top: '2px' }}
      />
      <span style={{ position: 'relative', top: '-7px', margin: '0 10px 0 2px' }}>
        <FormattedMessage id="LOGIN" />
      </span>
    </button>
  );
};

export default GoToLoginPageButton;