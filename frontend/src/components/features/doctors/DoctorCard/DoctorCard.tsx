import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import { Doctor } from '../../../../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface DoctorCardProps {
    doctor: Doctor;
    onSelect: (doctor: Doctor) => void;
    isSelected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, isSelected }) => {
    return (
        <Card
            className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer border-2",
                isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/20"
            )}
            onClick={() => onSelect(doctor)}
        >
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    {/* Avatar Placeholder */}
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {doctor.image_url ? (
                            <img src={doctor.image_url} alt={`Dr. ${doctor.last_name}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                                {doctor.first_name[0]}{doctor.last_name[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Dr. {doctor.first_name} {doctor.last_name}</h3>
                        <p className="text-primary font-medium text-sm">{doctor.specialization}</p>

                        <div className="mt-3 space-y-1.5">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 mr-1.5 fill-current" />
                                <span>4.8 (120 reviews)</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                <span>{doctor.clinic_address || 'Main Medical Center'}</span>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>Available Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-gray-50/50 flex justify-end">
                <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(doctor);
                    }}
                >
                    {isSelected ? 'Selected' : 'Select Doctor'}
                </Button>
            </CardFooter>
        </Card>
    );
};
