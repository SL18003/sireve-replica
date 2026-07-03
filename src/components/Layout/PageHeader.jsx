import { Text, Icon } from '@gravity-ui/uikit';

export default function PageHeader({ title, subtitle, icon }) {
  return (
    <div className="page-hero">
      {icon && <Icon data={icon} size={40} className="page-hero-icon" />}
      <Text variant="display-2" as="h1" className="page-hero-title">{title}</Text>
      {subtitle && (
        <Text variant="body-2" className="page-hero-sub">{subtitle}</Text>
      )}
    </div>
  );
}
