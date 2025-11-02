import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DynFieldContainer } from './DynFieldContainer';
import { DynInput } from '../DynInput/DynInput';
import { DynTextArea } from '../DynTextArea/DynTextArea';
import { DynSelect } from '../DynSelect/DynSelect';
import { DynCheckbox } from '../DynCheckbox/DynCheckbox';
import { DynRadio } from '../DynRadio/DynRadio';
import { DynButton } from '../DynButton/DynButton';
import { DynBox } from '../DynBox/DynBox';

const meta: Meta<typeof DynFieldContainer> = {
  title: 'Forms/DynFieldContainer',
  component: DynFieldContainer,
  parameters: {
    docs: {
      description: {
        component: `
**DynFieldContainer** provides a comprehensive wrapper for form fields with built-in validation, accessibility, and layout support.

### Features:
- Label with required indicator
- Description and hint text
- Error state with validation messages
- Vertical and horizontal layouts
- Proper ARIA associations
- Design token integration
        `
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label-title-only', enabled: false },
          { id: 'form-field-multiple-labels', enabled: false }
        ]
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label text displayed above the control'
    },
    description: {
      control: 'text',
      description: 'Additional description text to explain the field'
    },
    hint: {
      control: 'text', 
      description: 'Hint text to help users understand the field'
    },
    error: {
      control: 'text',
      description: 'Error message displayed when validation fails'
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator and adds semantic meaning'
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Layout direction for label and control'
    },
    htmlFor: {
      control: 'text',
      description: 'HTML for attribute to associate label with form control'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic field container with label and form control.
 */
export const Default: Story = {
  args: {
    label: 'Username',
    htmlFor: 'username-basic',
    children: <DynInput id="username-basic" placeholder="Enter your username" />
  }
};

/**
 * Field with description text providing additional context.
 */
export const WithDescription: Story = {
  args: {
    label: 'Email Address',
    description: 'We\'ll use this email to send you important notifications and updates.',
    htmlFor: 'email-desc',
    children: <DynInput id="email-desc" type="email" placeholder="john.doe@example.com" />
  }
};

/**
 * Field with hint text to guide user input.
 */
export const WithHint: Story = {
  args: {
    label: 'Password',
    hint: 'Must be at least 8 characters with numbers and special characters',
    required: true,
    htmlFor: 'password-hint',
    children: <DynInput id="password-hint" type="password" placeholder="Enter secure password" />
  }
};

/**
 * Error state showing validation feedback.
 */
export const WithError: Story = {
  args: {
    label: 'Phone Number',
    error: 'Please enter a valid phone number in format: (123) 456-7890',
    required: true,
    htmlFor: 'phone-error',
    children: <DynInput id="phone-error" value="123" placeholder="(123) 456-7890" />
  }
};

/**
 * Required field with visual and semantic indicators.
 */
export const Required: Story = {
  args: {
    label: 'Full Name',
    description: 'Enter your first and last name as they appear on official documents.',
    required: true,
    htmlFor: 'fullname-req',
    children: <DynInput id="fullname-req" placeholder="John Doe" />
  }
};

/**
 * Horizontal layout with label and control side-by-side.
 */
export const HorizontalLayout: Story = {
  args: {
    label: 'Subscribe to Newsletter',
    description: 'Receive weekly updates about new features and improvements.',
    orientation: 'horizontal',
    htmlFor: 'newsletter-horiz',
    children: <DynCheckbox id="newsletter-horiz" />
  }
};

/**
 * Form field variations with different input types.
 */
export const FormFieldTypes: Story = {
  render: () => (
    <DynBox display="flex" direction="column" gap="xl">
      {/* Text Input */}
      <DynFieldContainer
        label="Company Name"
        description="The official registered name of your organization."
        required
        htmlFor="company-name"
      >
        <DynInput id="company-name" placeholder="Acme Corporation" />
      </DynFieldContainer>

      {/* TextArea */}
      <DynFieldContainer
        label="Project Description"
        hint="Provide a detailed description of your project goals and requirements (minimum 50 characters)."
        htmlFor="project-desc"
      >
        <DynTextArea 
          id="project-desc" 
          placeholder="Describe your project..."
          rows={4}
        />
      </DynFieldContainer>

      {/* Select */}
      <DynFieldContainer
        label="Country"
        required
        htmlFor="country-select"
      >
        <DynSelect 
          id="country-select"
          placeholder="Select your country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' }
          ]}
        />
      </DynFieldContainer>

      {/* Checkbox */}
      <DynFieldContainer
        label="Terms and Conditions"
        orientation="horizontal"
        required
        htmlFor="terms-accept"
      >
        <DynCheckbox id="terms-accept">
          I agree to the terms of service and privacy policy
        </DynCheckbox>
      </DynFieldContainer>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various form field types wrapped in DynFieldContainer for consistent styling and accessibility.'
      }
    }
  }
};

/**
 * Form validation states demonstration.
 */
export const ValidationStates: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      agreed: false
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      
      // Confirm password validation
      if (formData.password && formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // Terms agreement
      if (!formData.agreed) {
        newErrors.agreed = 'You must agree to the terms to continue';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = validateForm();
      if (isValid) {
        alert('Form submitted successfully!');
      }
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <DynBox display="flex" direction="column" gap="lg">
          <DynFieldContainer
            label="Email Address"
            description="This will be your login username"
            error={errors.email}
            required
            htmlFor="val-email"
          >
            <DynInput
              id="val-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </DynFieldContainer>
          
          <DynFieldContainer
            label="Password"
            hint="Must contain at least 8 characters"
            error={errors.password}
            required
            htmlFor="val-password"
          >
            <DynInput
              id="val-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Create a secure password"
            />
          </DynFieldContainer>
          
          <DynFieldContainer
            label="Confirm Password"
            error={errors.confirmPassword}
            required
            htmlFor="val-confirm"
          >
            <DynInput
              id="val-confirm"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Repeat your password"
            />
          </DynFieldContainer>
          
          <DynFieldContainer
            label="Terms Agreement"
            orientation="horizontal"
            error={errors.agreed}
            required
            htmlFor="val-terms"
          >
            <DynCheckbox
              id="val-terms"
              checked={formData.agreed}
              onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
            >
              I agree to the terms of service and privacy policy
            </DynCheckbox>
          </DynFieldContainer>
          
          <DynBox pt="md">
            <DynButton type="submit" variant="solid" color="primary" size="lg">
              Create Account
            </DynButton>
          </DynBox>
        </DynBox>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive form with real-time validation demonstrating error states and proper accessibility patterns.'
      }
    }
  }
};

/**
 * Complex form layout with mixed field types and orientations.
 */
export const ComplexForm: Story = {
  render: () => (
    <form>
      <DynBox display="flex" direction="column" gap="xl">
        {/* Personal Information Section */}
        <DynBox>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--dyn-color-text-primary)' }}>
            Personal Information
          </h3>
          
          <DynBox display="flex" direction="column" gap="lg">
            <DynBox display="flex" gap="lg" style={{ flexWrap: 'wrap' }}>
              <DynBox style={{ flex: 1, minWidth: '250px' }}>
                <DynFieldContainer
                  label="First Name"
                  required
                  htmlFor="complex-fname"
                >
                  <DynInput id="complex-fname" placeholder="John" />
                </DynFieldContainer>
              </DynBox>
              
              <DynBox style={{ flex: 1, minWidth: '250px' }}>
                <DynFieldContainer
                  label="Last Name"
                  required
                  htmlFor="complex-lname"
                >
                  <DynInput id="complex-lname" placeholder="Doe" />
                </DynFieldContainer>
              </DynBox>
            </DynBox>
            
            <DynFieldContainer
              label="Date of Birth"
              hint="You must be 18 or older to create an account"
              htmlFor="complex-dob"
            >
              <DynInput id="complex-dob" type="date" />
            </DynFieldContainer>
          </DynBox>
        </DynBox>

        {/* Contact Information Section */}
        <DynBox>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--dyn-color-text-primary)' }}>
            Contact Information
          </h3>
          
          <DynBox display="flex" direction="column" gap="lg">
            <DynFieldContainer
              label="Email Address"
              description="We'll send account verification to this address"
              required
              htmlFor="complex-email"
            >
              <DynInput 
                id="complex-email" 
                type="email" 
                placeholder="john.doe@example.com" 
              />
            </DynFieldContainer>
            
            <DynFieldContainer
              label="Phone Number"
              hint="Include country code (e.g. +1 for US/Canada)"
              htmlFor="complex-phone"
            >
              <DynInput id="complex-phone" placeholder="+1 (555) 123-4567" />
            </DynFieldContainer>
          </DynBox>
        </DynBox>

        {/* Preferences Section */}
        <DynBox>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--dyn-color-text-primary)' }}>
            Preferences
          </h3>
          
          <DynBox display="flex" direction="column" gap="lg">
            <DynFieldContainer
              label="Preferred Contact Method"
              htmlFor="complex-contact-method"
            >
              <DynBox display="flex" direction="column" gap="sm">
                <DynRadio name="contactMethod" value="email">
                  Email notifications
                </DynRadio>
                <DynRadio name="contactMethod" value="phone">
                  Phone calls
                </DynRadio>
                <DynRadio name="contactMethod" value="sms">
                  Text messages
                </DynRadio>
              </DynBox>
            </DynFieldContainer>
            
            <DynFieldContainer
              label="Marketing Communications"
              orientation="horizontal"
              htmlFor="complex-marketing"
            >
              <DynCheckbox id="complex-marketing">
                Send me updates about new features and products
              </DynCheckbox>
            </DynFieldContainer>
          </DynBox>
        </DynBox>
        
        {/* Submit Section */}
        <DynBox pt="lg" style={{ borderTop: '1px solid var(--dyn-color-border-primary)' }}>
          <DynBox display="flex" gap="md">
            <DynButton variant="solid" color="primary" size="lg">
              Create Account
            </DynButton>
            <DynButton variant="solid" color="secondary" size="lg">
              Cancel
            </DynButton>
          </DynBox>
        </DynBox>
      </DynBox>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex multi-section form demonstrating various field types, layouts, and proper semantic structure with field containers.'
      }
    }
  }
};

/**
 * Interactive playground for testing field container properties.
 */
export const Interactive: Story = {
  args: {
    label: 'Interactive Field',
    description: 'This is a sample description explaining the field purpose.',
    hint: 'This hint provides additional guidance for users.',
    required: false,
    orientation: 'vertical',
    htmlFor: 'interactive-field',
    children: <DynInput id="interactive-field" placeholder="Enter some text..." />
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with all DynFieldContainer properties and see their effects in real-time.'
      }
    }
  }
};