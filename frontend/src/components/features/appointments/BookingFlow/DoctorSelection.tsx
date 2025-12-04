import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchDoctors, setSelectedDoctor, setFilters } from '../../../../store/slices/doctorSlice';
import { setBookingStep, updateBookingData } from '../../../../store/slices/appointmentSlice';
import { DoctorCard } from '../../doctors/DoctorCard/DoctorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const DoctorSelection: React.FC = () => {
    const dispatch = useAppDispatch();
    const { doctors, loading, selectedDoctor, filters } = useAppSelector((state) => state.doctors);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch]);

    const handleDoctorSelect = (doctor: any) => {
        dispatch(setSelectedDoctor(doctor));
    };

    const handleNext = () => {
        if (selectedDoctor) {
            dispatch(updateBookingData({ doctorId: selectedDoctor.id }));
            dispatch(setBookingStep(2));
        }
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch =
            doc.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            doc.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(filters.search.toLowerCase());

        const matchesSpecialization = filters.specialization
            ? doc.specialization === filters.specialization
            : true;

        return matchesSearch && matchesSpecialization;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3 space-y-2">
                    <Label>Search Doctors</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Name or specialty..."
                            className="pl-9"
                            value={filters.search}
                            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Add Specialization Filter Dropdown here if needed */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Loading Skeletons
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
                    ))
                ) : filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onSelect={handleDoctorSelect}
                            isSelected={selectedDoctor?.id === doctor.id}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No doctors found matching your criteria.
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t">
                <Button
                    onClick={handleNext}
                    disabled={!selectedDoctor}
                    size="lg"
                >
                    Continue to Date & Time
                </Button>
            </div>
        </div>
    );
};
