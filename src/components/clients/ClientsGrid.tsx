import { Reveal } from "@/components/motion/reveal";
import { ClientCard } from "./ClientCard";
import {
  findClientLogo,
  findClientScale,
  findClientLogoById,
  findClientScaleById,
} from "@/data/clients";

interface ClientItem {
  num: string;
  name: string;
  desc: string;
  tags: string[];
  logoId?: string;
}

interface Props {
  items: ClientItem[];
}

export function ClientsGrid({ items }: Props) {
  return (
    <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
      {items.map((c) => (
        <ClientCard
          key={c.num || c.name}
          num={c.num}
          name={c.name}
          desc={c.desc}
          tags={c.tags}
          logo={c.logoId ? findClientLogoById(c.logoId) : findClientLogo(c.name)}
          logoScale={c.logoId ? findClientScaleById(c.logoId) : findClientScale(c.name)}
        />
      ))}
    </Reveal>
  );
}
