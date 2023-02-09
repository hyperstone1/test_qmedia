import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import { host } from '../constants/constants';

const FormRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seminar, setSeminar] = useState('');
  const [focus, setFocus] = useState([
    { type: 'text', focus: false, value: '' },
    {
      type: 'email',
      focus: false,
      value: '',
    },
    {
      type: 'select-one',
      focus: false,
      value: '',
    },
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFocus(
      focus.map((item) =>
        item.type === 'text'
          ? { ...item, value: name }
          : item && item.type === 'email'
          ? { ...item, value: email }
          : item && item.type === 'select-one'
          ? { ...item, value: seminar }
          : item,
      ),
    );
    // eslint-disable-next-line
  }, [name, email, seminar]);

  const handleFocusInput = (e) => {
    setFocus(
      focus.map((item) =>
        item.type === e.target.type ? { ...item, focus: true } : { ...item, focus: false },
      ),
    );
  };

  const handleBlurInput = (e) => {
    setFocus(focus.map((item) => ({ ...item, focus: false })));
  };

  const handleChangeInput = (e, type) => {
    if (type === 'text') {
      setName(e.target.value);
    } else {
      setEmail(e.target.value);
    }
    if (!!errors[type]) {
      setErrors({
        ...errors,
        [type]: null,
      });
    }
  };

  const handleChangeSelect = (e, type) => {
    setSeminar(e.target.value);
    if (!!errors[type]) {
      setErrors({
        ...errors,
        [type]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setLoading(true);
      try {
        const { data } = await axios.post(`${host}/api/send_mail`, {
          name,
          email,
          seminar,
        });
        Swal.fire({
          icon: 'success',
          title: 'Заявка отправлена.',
          text: data,
        });
      } catch ({ response }) {
        Swal.fire({
          icon: 'error',
          title: 'Неудача.',
          text: response,
        });
      }
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Пожалуйста введите ваш email';
    else if (
      !email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/)
    ) {
      newErrors.email = 'Некорректный email';
    }
    if (!name || name === '') newErrors.text = 'Пожалуйста введите ваше имя';
    else if (!name.match(/[^-А-ЯA-Z\x27а-яa-z]/)) {
      newErrors.text = 'Некорректное имя';
    }
    if (!seminar || seminar === '') newErrors.select = 'Пожалуйста выберите семинар';

    return newErrors;
  };

  return (
    <div className="container_form">
      <div className="content">
        <div className="info">
          <h2 className="title">Отправить заявку на участие в семинаре</h2>
          <span>
            <p>Организаторы свяжутся с вами для подтверждения записи.</p>
            <p>
              Участие в семинаре <u>бесплатное</u>.
            </p>
          </span>
        </div>
        <Form onSubmit={handleSubmit}>
          {focus &&
            focus.map((item, idx) =>
              item.type !== 'select-one' ? (
                <Form.Group
                  key={idx}
                  className="mb-3"
                  controlId={item.type === 'text' ? 'formBasicName' : 'formBasicEmail'}
                >
                  <Form.Control
                    onChange={(e) => handleChangeInput(e, item.type)}
                    onFocus={handleFocusInput}
                    onBlur={handleBlurInput}
                    type={item.type === 'text' ? 'text' : 'email'}
                    isInvalid={item.type === 'text' ? !!errors.text : !!errors.email}
                    disabled={loading ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {item.type === 'text' ? errors.text : errors.email}
                  </Form.Control.Feedback>
                  <Form.Label
                    className={
                      item.focus === true || item.value !== ''
                        ? 'placeholder_focus'
                        : 'placeholder_input'
                    }
                  >
                    {item.type === 'text' ? 'Ваше имя' : 'Контактный email'}
                  </Form.Label>
                </Form.Group>
              ) : (
                <Form.Group key={idx} className="mb-3" controlId="formBasicPassword">
                  <Form.Label
                    className={
                      item.focus === true || item.value !== ''
                        ? 'placeholder_focus'
                        : 'placeholder_input'
                    }
                  >
                    Интересующий семинар
                  </Form.Label>
                  <Form.Select
                    type="select"
                    onFocus={handleFocusInput}
                    onBlur={handleBlurInput}
                    onChange={(e) => handleChangeSelect(e, 'select')}
                    value={seminar}
                    disabled={loading ? true : false}
                    isInvalid={!!errors.select}
                  >
                    <option style={{ display: 'none' }} value="0"></option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.select}</Form.Control.Feedback>
                </Form.Group>
              ),
            )}
          <Form.Group className="mb-3 d-flex" controlId="formBasicPassword">
            <Form.Label className="agreement_info">
              <p>Все поля обязательны для заполнения.</p>
              <span>
                Отправляя заявку вы соглашаетесь с договором публичной оферты и политикой обработки
                данных.
              </span>
            </Form.Label>
            <Button disabled={loading ? true : false} variant="primary" type="submit">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                'Отправить'
              )}
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default FormRegister;
