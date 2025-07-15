import React, { useState, useEffect } from 'react';

interface PasswordValidatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({ 
  password, 
  showRequirements = true 
}) => {
  const [validations, setValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password)
    });
  }, [password]);

  if (!showRequirements || password.length === 0) {
    return null;
  }

  const requirements = [
    { key: 'length', text: 'Mínimo 8 caracteres', valid: validations.length },
    { key: 'lowercase', text: 'Al menos una letra minúscula', valid: validations.lowercase },
    { key: 'uppercase', text: 'Al menos una letra mayúscula', valid: validations.uppercase },
    { key: 'number', text: 'Al menos un número', valid: validations.number }
  ];

  return (
    <div className="password-validator">
      <div className="password-requirements">
        <small>
          <strong>Requisitos de contraseña:</strong>
        </small>
        <ul className="requirements-list">
          {requirements.map((req) => (
            <li 
              key={req.key} 
              className={`requirement ${req.valid ? 'valid' : 'invalid'}`}
            >
              <span className="requirement-icon">
                {req.valid ? '✅' : '❌'}
              </span>
              {req.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordValidator;
