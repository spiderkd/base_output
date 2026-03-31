"use client";

import * as React from "react";
import { Button } from "@/registry/riso/ui/button";
import { Checkbox } from "@/registry/riso/ui/checkbox";
import { Drawer } from "@/registry/riso/ui/drawer";
import { RadioGroup } from "@/registry/riso/ui/radio-group";
import { Separator } from "@/registry/riso/ui/separator";
import { Slider } from "@/registry/riso/ui/slider";
import { Tabs } from "@/registry/riso/ui/tabs";
import { Toggle } from "@/registry/riso/ui/toggle";
import * as RisoUtils from "@/lib/riso-utils";

export interface SettingsState {
  darkMode: boolean;
  highContrast: boolean;
  grainIntensity: number;
  density: "compact" | "default" | "relaxed";
  notifications: {
    jobComplete: boolean;
    regError: boolean;
    inkLow: boolean;
    emailDigest: boolean;
  };
  ink: {
    primaryOpacity: number;
    secondaryOpacity: number;
    misregOffset: number;
    blendMode: string;
  };
}

export interface SettingsPanelProps extends RisoUtils.RisoThemeProps {
  open: boolean;
  onClose: () => void;
  onSave?: (settings: SettingsState) => void;
}

const INITIAL_SETTINGS: SettingsState = {
  darkMode: false,
  highContrast: false,
  grainIntensity: 48,
  density: "default",
  notifications: {
    jobComplete: true,
    regError: true,
    inkLow: false,
    emailDigest: true,
  },
  ink: {
    primaryOpacity: 80,
    secondaryOpacity: 60,
    misregOffset: 3,
    blendMode: "multiply",
  },
};

export function SettingsPanel({
  open,
  onClose,
  onSave,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: SettingsPanelProps) {
  const risoStyle = RisoUtils.resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [settings, setSettings] = React.useState<SettingsState>(INITIAL_SETTINGS);
  const [tabsKey, setTabsKey] = React.useState(0);
  const previousOpen = React.useRef(open);

  React.useEffect(() => {
    if (previousOpen.current && !open) {
      setTabsKey((value) => value + 1);
    }
    previousOpen.current = open;
  }, [open]);

  const handleCancel = () => {
    setSettings(INITIAL_SETTINGS);
    onClose();
  };

  const handleSave = () => {
    onSave?.(settings);
    onClose();
  };

  return (
    <div style={risoStyle}>
      <Drawer
        open={open}
        onClose={onClose}
        title="Settings"
        description="Adjust appearance, notifications, and ink behaviour."
        width={420}
        theme={theme}
        primary={primary}
        secondary={secondary}
        overlap={overlap}
        paper={paper}
      >
        <div className="flex min-h-full flex-col">
          <Tabs
            key={tabsKey}
            defaultValue="appearance"
            tabs={[
              {
                value: "appearance",
                label: "Appearance",
                content: (
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <Toggle
                        label="Dark mode"
                        checked={settings.darkMode}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            darkMode: event.target.checked,
                          }))
                        }
                      />
                      <Toggle
                        label="High contrast"
                        checked={settings.highContrast}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            highContrast: event.target.checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <Slider
                      min={0}
                      max={100}
                      value={settings.grainIntensity}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          grainIntensity: value,
                        }))
                      }
                      label="Grain intensity"
                    />

                    <RadioGroup
                      label="Layout density"
                      value={settings.density}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          density: value as SettingsState["density"],
                        }))
                      }
                      options={[
                        { value: "compact", label: "Compact" },
                        { value: "default", label: "Default" },
                        { value: "relaxed", label: "Relaxed" },
                      ]}
                    />
                  </div>
                ),
              },
              {
                value: "notifications",
                label: "Notifs",
                content: (
                  <div className="space-y-4">
                    <Checkbox
                      label="Print job complete"
                      checked={settings.notifications.jobComplete}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          notifications: {
                            ...current.notifications,
                            jobComplete: event.target.checked,
                          },
                        }))
                      }
                    />
                    <Checkbox
                      label="Registration error"
                      checked={settings.notifications.regError}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          notifications: {
                            ...current.notifications,
                            regError: event.target.checked,
                          },
                        }))
                      }
                    />
                    <Checkbox
                      label="Ink low warning"
                      checked={settings.notifications.inkLow}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          notifications: {
                            ...current.notifications,
                            inkLow: event.target.checked,
                          },
                        }))
                      }
                    />
                    <Separator />
                    <Toggle
                      label="Email digest"
                      checked={settings.notifications.emailDigest}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          notifications: {
                            ...current.notifications,
                            emailDigest: event.target.checked,
                          },
                        }))
                      }
                    />
                  </div>
                ),
              },
              {
                value: "ink",
                label: "Ink",
                content: (
                  <div className="space-y-5">
                    <Slider
                      min={0}
                      max={100}
                      value={settings.ink.primaryOpacity}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          ink: { ...current.ink, primaryOpacity: value },
                        }))
                      }
                      label="Primary ink opacity"
                    />
                    <Slider
                      min={0}
                      max={100}
                      value={settings.ink.secondaryOpacity}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          ink: { ...current.ink, secondaryOpacity: value },
                        }))
                      }
                      label="Secondary ink opacity"
                    />
                    <Slider
                      min={0}
                      max={8}
                      value={settings.ink.misregOffset}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          ink: { ...current.ink, misregOffset: value },
                        }))
                      }
                      label="Misregistration offset"
                    />
                    <RadioGroup
                      label="Blend mode"
                      value={settings.ink.blendMode}
                      onChange={(value) =>
                        setSettings((current) => ({
                          ...current,
                          ink: { ...current.ink, blendMode: value },
                        }))
                      }
                      options={[
                        { value: "multiply", label: "Multiply" },
                        { value: "screen", label: "Screen" },
                        { value: "overlay", label: "Overlay" },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />

          <div className="sticky bottom-0 mt-auto space-y-4 bg-[var(--riso-paper)] pt-4">
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
