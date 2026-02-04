"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { RichTextEditor } from "@shared/ui/rich-text-editor";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { MultiImageUpload } from "@features/multi-image-upload";
import { useProductForm } from "../lib/useProductForm";
import { CategoryTreeSelect } from "./CategoryTreeSelect";
import type { ProductFormProps } from "../model/interface";

export default function ProductForm(props: ProductFormProps) {
  const {
    form,
    onSubmit,
    isSubmitting,
    t,
    cities,
    // Category tree props
    treeNodes,
    categorySelection,
    expandedNodes,
    addNewMode,
    handleToggleExpand,
    handleSelect,
    handleAddNewStart,
    handleAddNewChange,
    handleAddNewSubmit,
    handleAddNewCancel,
    isSelected,
    isInSelectedPath,
  } = useProductForm(props);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] w-[1100px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {props.mode === "create" ? t("createProduct") : t("editProduct")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Product Details */}
              <div className="space-y-4">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("namePlaceholder")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Short Description */}
                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shortDescription")} *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("shortDescriptionPlaceholder")}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Selection - Tree View */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t("category")} *</FormLabel>
                      <FormControl>
                        <CategoryTreeSelect
                          treeNodes={treeNodes}
                          selection={categorySelection}
                          expandedNodes={expandedNodes}
                          addNewMode={addNewMode}
                          onSelect={handleSelect}
                          onToggleExpand={handleToggleExpand}
                          onAddNewStart={handleAddNewStart}
                          onAddNewChange={handleAddNewChange}
                          onAddNewSubmit={handleAddNewSubmit}
                          onAddNewCancel={handleAddNewCancel}
                          isSelected={isSelected}
                          isInSelectedPath={isInSelectedPath}
                          error={form.formState.errors.category_id?.message}
                          disabled={isSubmitting}
                          t={t}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - City, Images, Description, Pricing */}
              <div className="space-y-4">
                {/* City (Required) */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city")} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("cityPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images section */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("images")} *</FormLabel>
                      <FormControl>
                        <MultiImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Description with Rich Text Editor */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")}</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("descriptionPlaceholder")}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price and Quantity Row */}
                <div className="grid gap-4 grid-cols-2">
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("price")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            placeholder={t("pricePlaceholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("quantity")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            placeholder={t("quantityPlaceholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* is_active Checkbox - 1 = Active, 2 = Disabled */}
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 1}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 1 : 2)
                          }
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">{t("isActive")}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => props.onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
