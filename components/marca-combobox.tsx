'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const MARCAS = [
  {
    grupo: 'Cosméticos & Beleza',
    items: [
      'Natura',
      'Avon',
      'O Boticário',
      'Eudora',
      'Mary Kay',
      'Hinode',
      'Jequiti',
      'Racco',
      'Mahogany',
      'Yes Cosmetics',
      "L'Bel",
      'Ésika',
      'Cyzone',
      'Belcorp',
    ],
  },
  {
    grupo: 'Utilidades Domésticas',
    items: ['Tupperware', 'Polishop', 'Hermes'],
  },
  {
    grupo: 'Nutrição & Suplementos',
    items: ['Herbalife', 'Amway / Nutrilite', 'Omnilife', 'Yakult'],
  },
  {
    grupo: 'Outros',
    items: ['Vendo mais de uma', 'Ainda não vendo'],
  },
];

interface MarcaComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function MarcaCombobox({
  value,
  onValueChange,
  error,
  disabled,
}: MarcaComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const normalizedSearch = search.trim().toLowerCase();

  const filteredMarcas = React.useMemo(
    () =>
      MARCAS.map((grupo) => ({
        ...grupo,
        items: grupo.items.filter(
          (item) =>
            !normalizedSearch ||
            item.toLowerCase().includes(normalizedSearch),
        ),
      })).filter((grupo) => grupo.items.length > 0),
    [normalizedSearch],
  );

  const allItems = MARCAS.flatMap((g) => g.items);
  const hasExactMatch = allItems.some(
    (item) => item.toLowerCase() === normalizedSearch,
  );
  const showAddOption =
    normalizedSearch.length > 0 && !hasExactMatch;

  const totalVisibleItems =
    filteredMarcas.reduce((sum, g) => sum + g.items.length, 0) +
    (showAddOption ? 1 : 0);

  function handleSelect(selected: string) {
    onValueChange(selected === value ? '' : selected);
    setSearch('');
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearch('');
    }
    setOpen(nextOpen);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar a marca que você mais vende"
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive focus-visible:ring-destructive',
          )}
          disabled={disabled}
        >
          <span className="truncate">{value || 'Selecionar marca...'}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <div className="sticky top-0 z-10 bg-popover">
            <CommandInput
              placeholder="Buscar ou digitar marca..."
              value={search}
              onValueChange={setSearch}
            />
          </div>

          <CommandList className="max-h-60">
            {totalVisibleItems === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma marca encontrada.
              </p>
            )}

            {filteredMarcas.map(({ grupo, items }) => (
              <CommandGroup key={grupo} heading={grupo}>
                {items.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleSelect(item)}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        value === item ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

            {showAddOption && (
              <CommandGroup>
                <CommandItem
                  value={`__add__${search.trim()}`}
                  onSelect={() => handleSelect(search.trim())}
                >
                  <span className="text-primary">
                    + Adicionar &ldquo;{search.trim()}&rdquo;
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
